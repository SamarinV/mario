import Matter from 'matter-js'
import { EngineContext, EntitiesType } from './types'

export const cutsceneSystem = (entities: EntitiesType, { dispatch }: EngineContext) => {
	const { player, flagpole, castle, physics } = entities
	if (!flagpole || !player) return entities

	//Инициализация скольжения при касании флага
	if (!flagpole.isLowering && !flagpole.isWalkingToCastle) {
		const pairs = physics.engine.pairs.list
		for (const pair of pairs) {
			const labels = [pair.bodyA.label, pair.bodyB.label]
			if (labels.includes('Player') && labels.includes('Flagpole')) {
				flagpole.isLowering = true
				player.currentMoveX = 0
				player.isCutscene = true
				Matter.Body.setVelocity(player.body, { x: 0, y: 2 })
				break
			}
		}
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
			dispatch({ type: 'level_completed' })
		}
	}

	return entities
}
