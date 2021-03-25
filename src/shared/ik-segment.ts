import Make from "@rbxts/make"

const line = Make("Frame", {
	AnchorPoint: new Vector2(0.5, 0.5),
	Transparency: 0.5,
	Children: [
		Make("UICorner", {
			CornerRadius: new UDim(1, 0),
		}),
	],
})

interface IDrawableObject {
	show(parent: GuiObject): void
}

export class IKSegment implements IDrawableObject {
	public a: Vector2
	public b = new Vector2()

	public parent?: IKSegment

	constructor(x: number, y: number, public length: number, public angle: number) {
		this.a = new Vector2(x, y)
		this.calculateB()
	}

	private calculateB() {
		const dx = math.cos(math.rad(this.angle)) * this.length
		const dy = math.sin(math.rad(this.angle)) * this.length
		this.b = new Vector2(this.a.X + dx, this.a.Y + dy)
	}

	public follow(target: Vector2) {
		const direction = target.sub(this.a).Unit
		this.a = target.add(direction.mul(-1).mul(this.length))
		this.b = target
		this.angle = math.deg(math.atan2(direction.Y, direction.X))
	}

	public update() {
		this.calculateB()
	}

	public show(parent: GuiObject, thickness = 2) {
		const display = line.Clone()
		const pos = this.a.add(this.b).div(2)
		display.Position = UDim2.fromOffset(pos.X, pos.Y)
		display.Rotation = this.angle
		display.Size = UDim2.fromOffset(this.length + thickness, thickness)
		display.Parent = parent
	}

	public setParent(parent: IKSegment) {
		this.parent = parent
		return this
	}

	public static fromSegment(segment: IKSegment, length: number, angle: number) {
		return new IKSegment(segment.b.X, segment.b.Y, length, segment.angle + angle).setParent(segment)
	}
}

export class Dot implements IDrawableObject {
	public position: Vector2

	constructor(x: number, y: number) {
		this.position = new Vector2(x, y)
	}

	show(parent: GuiObject, thickness = 20): void {
		const display = line.Clone()
		display.Position = UDim2.fromOffset(this.position.X, this.position.Y)
		display.Size = UDim2.fromOffset(thickness, thickness)
		display.BackgroundColor3 = new Color3(1, 0, 0)
		display.Transparency = 0
		display.Parent = parent
	}
}
