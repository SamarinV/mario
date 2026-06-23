import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { EngineContext, EntitiesType } from './types'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const physicsSystem = (entities: EntitiesType, { dispatch }: EngineContext) => {
	const { engine } = entities.physics
	const { player } = entities

	if (!player) return entities

	//Удержание скорости движения
	Matter.Body.setVelocity(player.body, { x: player.currentMoveX * 5, y: player.body.velocity.y })
	Matter.Engine.update(engine, 1000 / 60)

	// Проверка падения
	if (player.body.position.y > SCREEN_HEIGHT && !player.dead) {
		player.dead = true
		dispatch({ type: 'player_fell' })
	}

	return entities
}
