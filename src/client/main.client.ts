import { Players, RunService, StarterGui, UserInputService } from "@rbxts/services"
import { Dot, IKSegment } from "shared/ik-segment"
import { IKTentacle } from "shared/ik-tentacle"

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false)

const canvas = Players.LocalPlayer.WaitForChild("PlayerGui")
	.WaitForChild("ScreenGui")
	.WaitForChild("Canvas") as Frame

const tentacles: IKTentacle[] = []
for (let i = 100; i < canvas.AbsoluteSize.X; i += 100) {
	tentacles.push(new IKTentacle(new Vector2(i, canvas.AbsoluteSize.Y), 10))
}

const goal = new Dot(600, 100)
const gui_offset = new Vector2(0, 36)

// move tentacles towards mouse
RunService.RenderStepped.Connect((dt) => {
	goal.position = UserInputService.GetMouseLocation().sub(canvas.AbsolutePosition).sub(gui_offset)
	tentacles.forEach((tentacle) => tentacle.follow(goal.position))
	canvas.GetChildren().forEach((instance) => instance.Destroy())
	tentacles.forEach((tentacle) => tentacle.show(canvas))
	goal.show(canvas)
})
