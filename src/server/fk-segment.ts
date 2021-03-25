import Make from "@rbxts/make"
import { Workspace } from "@rbxts/services"

function calculateEndVector2(vector: Vector2, length: number, angle: number) {
	const dx = length * math.cos(math.rad(angle))
	const dy = length * math.sin(math.rad(angle))
	return new Vector2(vector.X + dx, vector.Y + dy)
}

function toVector3(vector: Vector2, z = 0) {
	return new Vector3(vector.X, vector.Y, z)
}

export class Segment {
	private part: BasePart
	private ball: BasePart
	public start_vector: Vector2
	public end_vector: Vector2

	private initial_angle: number
	private initial_offset?: number
	private parentOffset?: number

	private tick = 0
	private seed = math.random()

	private parent?: Segment
	private child?: Segment

	constructor(x: number, y: number, public length: number, public angle = 0) {
		this.start_vector = new Vector2(x, y)
		this.end_vector = calculateEndVector2(this.start_vector, length, angle)
		this.initial_angle = angle

		this.part = Make("Part", {
			Material: Enum.Material.Neon,
			Shape: Enum.PartType.Cylinder,
			Anchored: true,
			Size: new Vector3(length, 0.25, 0.25),
			Locked: true,
		})

		this.ball = Make("Part", {
			Material: Enum.Material.Neon,
			Shape: Enum.PartType.Ball,
			Anchored: true,
			Size: new Vector3(0.25, 0.25, 0.25),
			Locked: true,
		})
	}

	protected setParent(parent: Segment) {
		this.parent = parent
		this.parentOffset = this.angle - parent.angle
		this.initial_offset = this.parentOffset
		return this
	}

	protected setChild(child: Segment) {
		this.child = child
		return this
	}

	public wiggle(amt: number, range: number) {
		this.tick += amt

		const v = math.noise(this.tick / 10, this.seed) * range

		if (this.parent) {
			this.parentOffset = this.initial_offset! + v
		} else {
			this.angle = this.initial_angle + v // lock angle to certain degrees of initial value
		}

		this.update()
	}

	public update() {
		if (this.parent) {
			this.angle = this.parent.angle + this.parentOffset!
			this.start_vector = this.parent.end_vector
		}

		this.calculateEndVector()

		if (this.child) {
			this.child.update()
		}
	}

	public calculateEndVector() {
		this.end_vector = calculateEndVector2(
			this.start_vector,
			this.length,
			this.angle
		)
	}

	public show() {
		// move part, rotate part, shift forward by half of length
		const offset = new CFrame(0, 0, -this.length / 2)
		this.part.CFrame = new CFrame(
			toVector3(this.parent ? this.parent.end_vector : this.start_vector),
			toVector3(this.end_vector)
		)
			.mul(offset)
			.mul(CFrame.Angles(0, math.rad(90), 0))

		this.ball.Position = toVector3(this.end_vector)

		this.ball.Parent = Workspace
		this.part.Parent = Workspace
	}

	public static fromParent(
		parent: Segment,
		length: number,
		angle = 0
	): Segment {
		const segment = new Segment(
			parent.end_vector.X,
			parent.end_vector.Y,
			length,
			parent.angle + angle
		).setParent(parent)
		parent.setChild(segment)
		return segment
	}
}
