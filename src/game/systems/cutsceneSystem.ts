import Matter from 'matter-js'
import { EngineContext, EntitiesType } from './types'

export const cutsceneSystem = (
	entities: EntitiesType,
	{ events = [], dispatch }: EngineContext,
) => {
	const { player, flagpole, castle } = entities
	if (!flagpole || !player) return entities

	//Инициализация скольжения при касании флага
	if (!flagpole.isLowering && !flagpole.isWalkingToCastle) {
		events.forEach((event) => {
			if (event.type === 'level_completed') {
				flagpole.isLowering = true
				player.currentMoveX = 0
				player.isCutscene = true
				Matter.Body.setVelocity(player.body, { x: 0, y: 2 })
			}
		})
	}

	//Опускание флага
	if (flagpole.isLowering) {
		const maxOffset = flagpole.size[1] - 70
		if (flagpole.flagOffset < maxOffset) {
			flagpole.flagOffset += 2
		} else {
			flagpole.isLowering = false
			flagpole.isWalkingToCastle = true
		}
	}

	//Марио автоматически бежит внутрь замка
	if (flagpole.isWalkingToCastle) {
		player.state = 'runRight'
		player.currentMoveX = 0.3
		Matter.Body.setVelocity(player.body, { x: 1, y: player.body.velocity.y })

		if (castle && player.body.position.x >= castle.body.position.x) {
			flagpole.isWalkingToCastle = false
			player.currentMoveX = 0
			Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
		}
	}

	return entities
}
