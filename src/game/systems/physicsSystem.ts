import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { EngineContext, EntitiesType } from './types'

export const physicsSystem = (entities: EntitiesType, { dispatch }: EngineContext) => {
	const { engine } = entities.physics
	const { player } = entities

	if (!player) return entities
	Object.keys(entities).forEach((key) => {
		const entity = entities[key]

		if (entity?.life !== undefined) {
			entity.life--

			if (entity.life <= 0) {
				Matter.World.remove(entities.physics.world, entity.body)

				delete entities[key]
			}
		}
	})
	// Удержание скорости движения
	Matter.Body.setVelocity(player.body, { x: player.currentMoveX * 5, y: player.body.velocity.y })
	Matter.Engine.update(engine, 1000 / 60)



	// Проверка падения
	if (player.body.position.y > entities.physics.levelHeight + 200 && !player.dead) {
		player.dead = true
		dispatch({ type: 'player_fell' })
	}

	return entities
}
