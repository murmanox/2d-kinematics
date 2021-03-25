import { IKSegment } from "./ik-segment"

export class IKTentacle {
	private segments: IKSegment[]

	constructor(public origin: Vector2, segments: number) {
		let size = 70
		const segment_arr: IKSegment[] = [new IKSegment(origin.X, origin.Y, size, 45)]
		for (let i = 1; i <= segments; i++) {
			size *= 0.9

			const parent = segment_arr[i - 1]
			const new_segment = IKSegment.fromSegment(parent, size, 45)
			segment_arr.push(new_segment)
		}

		this.segments = segment_arr
	}

	private backwardSolve(goal: Vector2) {
		let target = goal
		for (let i = this.segments.size() - 1; i >= 0; i--) {
			this.segments[i].follow(target)
			target = this.segments[i].a
		}
	}

	private forwardSolve() {
		this.segments[0].a = this.origin
		this.segments[0].update()
		for (let i = 1; i < this.segments.size(); i++) {
			const current = this.segments[i]
			const previous = this.segments[i - 1]
			current.a = previous.b
			current.update()
		}
	}

	public follow(target: Vector2) {
		this.backwardSolve(target)
		this.forwardSolve()
	}

	public show(parent: GuiObject) {
		let thickness = this.segments.size() + 5
		this.segments.forEach((segment) => {
			segment.show(parent, thickness)
			thickness -= 1
		})
	}
}
