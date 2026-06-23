import Matter from 'matter-js'
import { EngineContext, EntitiesType } from './types'

export const controlSystem = (entities: EntitiesType, { events }: EngineContext) => {
	const { player } = entities
	if (!player) return entities

	player.currentMoveX = player.currentMoveX ?? 0

	// Очистка физического трения игрока
	if (player.body && player.body.friction !== 0) {
		Object.assign(player.body, { friction: 0, frictionStatic: 0, frictionAir: 0 })
	}

	events.forEach((event: any) => {
		if (player.isCutscene && ['move', 'stop', 'jump'].includes(event.type)) return

		switch (event.type) {
			case 'move':
				player.currentMoveX = event.x
				break
			case 'stop':
				player.currentMoveX = 0
				Matter.Body.setVelocity(player.body, { x: 0, y: player.body.velocity.y })
				break
			case 'jump':
				if (Math.abs(player.body.velocity.y) < 0.1) {
					Matter.Body.setVelocity(player.body, { x: player.body.velocity.x, y: -10 })
				}
				break
			case 'respawn':
				Matter.Body.setPosition(player.body, { x: player.body.position.x - 100, y: 250 })
				Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
				Matter.Body.setAngularVelocity(player.body, 0)
				player.currentMoveX = 0
				player.dead = false
				break
		}
	})

	return entities
}
