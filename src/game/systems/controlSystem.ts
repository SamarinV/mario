import Matter from 'matter-js'
import { EngineContext, EntitiesType } from './types'
import { createBlockDebris } from '../effects/createBlockDebris'

export const controlSystem = (
	entities: EntitiesType,
	{ events = [] }: EngineContext, // Убрали actions, оставили только events
) => {
	const { player } = entities
	if (!player) return entities

	const world = entities.physics.world
	player.currentMoveX = player.currentMoveX ?? 0

	// Очистка физического трения игрока
	if (player.body && player.body.friction !== 0) {
		Object.assign(player.body, { friction: 0, frictionStatic: 0, frictionAir: 0 })
	}

	// ОБРАБОТКА ВСЕХ СОБЫТИЙ (И управление, и удаление блоков приходят сюда)
	events.forEach((event: any) => {
		if (event.type === 'break_block') {
			const { blockKey, blockBody } = event.payload

			if (entities[blockKey]) {
				const x = blockBody.position.x
				const y = blockBody.position.y

				Matter.World.remove(world, blockBody)
				delete entities[blockKey]

				createBlockDebris(entities, world, x, y)
			}
		}

		// Логика катсцен
		if (player.isCutscene && ['move', 'stop', 'jump'].includes(event.type)) return

		// ИГРОВОЕ УПРАВЛЕНИЕ
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
			case 'coin_block_hit':
				const block = entities[event.payload.blockKey]

				if (!block || block.used) return entities

				block.used = true

				const coinId = `coin_fx_${Date.now()}`

				entities[coinId] = {
					x: block.body.position.x,
					y: block.body.position.y - 10,

					startY: block.body.position.y - 10,

					life: 70,
					renderer: require('../entities/Coin').Coin,
				}
				break
		}
	})

	return entities
}
