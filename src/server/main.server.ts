import { Players } from "@rbxts/services"

Players.PlayerAdded.Connect((player) => {
	player.CharacterAdded.Connect((character) => {
		;(character.WaitForChild("HumanoidRootPart") as Part).Anchored = true
	})
})
