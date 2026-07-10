import Matter from 'matter-js'
import { EngineContext, EntitiesType, PhysicsEvent } from './types'
import { createBlockDebris } from '../effects/createBlockDebris'

export const controlSystem = (
	entities: EntitiesType,
	{ events = [], dispatch }: EngineContext, // Убрали actions, оставили только events
) => {
	const { player } = entities
	if (!player) return entities

	const world = entities.physics.world

	// Очистка физического трения игрока
	if (player.body && player.body.friction !== 0) {
		Object.assign(player.body, { friction: 0, frictionStatic: 0, frictionAir: 0 })
	}

	const updateHud = (coins: number, score: number, lives: number) => {
		dispatch({
			type: 'hud_update',
			payload: {
				coins,
				score,
				lives,
			},
		})
	}
	// ОБРАБОТКА ВСЕХ СОБЫТИЙ (И управление, и удаление блоков приходят сюда)
	events.forEach((event) => {
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
				if (player.lives <= 0) return
				Matter.Body.setPosition(player.body, { x: player.body.position.x - 100, y: 250 })
				Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
				Matter.Body.setAngularVelocity(player.body, 0)
				player.currentMoveX = 0
				player.lives -= 1
				player.dead = false
				break
			case 'add_coins':
				entities.player.coins += event.value
				updateHud(entities.player.coins, entities.player.score, entities.player.lives)
				break
			case 'add_score':
				entities.player.score += event.value
				updateHud(entities.player.coins, entities.player.score, entities.player.lives)

				break
			case 'add_coins_and_score':
				entities.player.score += event.payload.score
				entities.player.coins += event.payload.coins
				updateHud(entities.player.coins, entities.player.score, entities.player.lives)

				break
			case 'break_block':
				const { blockKey, blockBody } = event.payload
				if (entities[blockKey]) {
					const x = blockBody.position.x
					const y = blockBody.position.y
					Matter.World.remove(world, blockBody)
					delete entities[blockKey]
					createBlockDebris(entities, world, x, y)
				}
				dispatch({
					type: 'add_score',
					value: 50,
				})
				break
			case 'coin_block_hit':
				const block = entities[event.payload.blockKey]
				if (!block || block.used) return
				block.used = true
				const coinId = `coin_fx_${Date.now()}`

				entities[coinId] = {
					x: block.body.position.x,
					y: block.body.position.y - 10,
					startY: block.body.position.y - 10,
					life: 70,
					renderer: require('../entities/Coin').Coin,
				}
				dispatch({
					type: 'add_coins_and_score',
					payload: {
						coins: 1,
						score: 100,
					},
				})
				break
			case 'goomba_dead': {
				const { goombaKey } = event.payload
				const goomba = entities[goombaKey]
				if (!goomba) break
				goomba.state = 'dead'
				if (goomba.body) {
					Matter.World.remove(world, goomba.body)
				}
				Matter.Body.setVelocity(player.body, {
					x: player.body.velocity.x,
					y: -7,
				})
				dispatch({
					type: 'add_score',
					value: 100,
				})
				setTimeout(() => {
					if (entities[goombaKey]) {
						if (entities[goombaKey].body) {
							Matter.World.remove(world, entities[goombaKey].body)
						}
						delete entities[goombaKey]
					}
				}, 600)
				break
			}
			case 'player_hit_by_goomba': {
				console.log('player hit by goomba')
				dispatch({
					type: 'respawn',
				})

				break
			}
		}
	})

	return entities
}
