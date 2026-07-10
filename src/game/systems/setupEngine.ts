import Matter from 'matter-js'
import { EntitiesType, PhysicsEvent } from '../systems/types'

export const getCollisionBodies = (pair: Matter.Pair) => {
	const { bodyA, bodyB } = pair
	const isPlayerA = bodyA.label === 'Player' || bodyA.parent?.label === 'Player'
	const isPlayerB = bodyB.label === 'Player' || bodyB.parent?.label === 'Player'
	const getMainBody = (body: Matter.Body) => {
		return body.parent || body
	}
	const findBodyByLabel = (bodyA: Matter.Body, bodyB: Matter.Body, name: string) => {
		if (bodyA.label.startsWith(name)) return bodyA
		if (bodyB.label.startsWith(name)) return bodyB
		return null
	}
	const isBothGoombas = bodyA.label?.startsWith('Goomba') && bodyB.label?.startsWith('Goomba')
	return {
		player: isPlayerA ? getMainBody(bodyA) : isPlayerB ? getMainBody(bodyB) : null,
		goomba: findBodyByLabel(bodyA, bodyB, 'Goomba'),
		flagpole: findBodyByLabel(bodyA, bodyB, 'Flagpole'),
		block: findBodyByLabel(bodyA, bodyB, 'Block') || findBodyByLabel(bodyA, bodyB, 'CoinBlock'),
		isBothGoombas,
	}
}

const getOtherBody = (bodyA: Matter.Body, bodyB: Matter.Body, current: Matter.Body) => {
	return bodyA === current ? bodyB : bodyA
}

export const setupEngine = (
	engine: Matter.Engine,
	entities: EntitiesType,
	dispatch: (event: PhysicsEvent) => void,
) => {
	Matter.Events.on(engine, 'collisionStart', (event) => {
		const hitBlocks: Array<{
			blockKey: string
			blockBody: Matter.Body
			distanceX: number
		}> = []

		event.pairs.forEach((pair) => {
			const { player, goomba, block, flagpole, isBothGoombas } = getCollisionBodies(pair)

			// ---------- GOOMBA/PLAYER ----------
			if (player && goomba) {
				const goombaKey = Object.keys(entities).find((key) => entities[key]?.body === goomba)
				if (!goombaKey) return
				const goombaEnity = entities[goombaKey]

				if (!goombaEnity || goombaEnity.state === 'dead') return
				const normal = pair.collision.normal
				const isPlayerAbove = normal.y < -0.5
				if (isPlayerAbove) {
					dispatch({
						type: 'goomba_dead',
						payload: {
							goombaKey,
						},
					})
				} else {
					dispatch({
						type: 'player_hit_by_goomba',
					})
					dispatch({
						type: 'goomba_change_direction',
						payload: { goombaKey },
					})
				}
			}

			// ---------- GOOMBA/SOLIDS-OBJECTS ----------
			if (goomba) {
				const goombaKey = Object.keys(entities).find((key) => entities[key]?.body === goomba)
				if (!goombaKey) return
				const other = getOtherBody(pair.bodyA, pair.bodyB, goomba)

				const isSolid =
					other.label.startsWith('Block') ||
					other.label.startsWith('Wall') ||
					other.label.startsWith('Goomba') ||
					other.label === 'Player'

				if (!isSolid) return

				const normal = pair.collision.normal

				// столкновение по X
				const isSideCollision = Math.abs(normal.x) > 0.7

				if (isSideCollision) {
					dispatch({
						type: 'goomba_change_direction',
						payload: { goombaKey },
					})
					if (other.label.startsWith('Goomba')) {
						const otherGoombaKey = Object.keys(entities).find(
							(key) => entities[key]?.body === other,
						)

						if (otherGoombaKey) {
							dispatch({
								type: 'goomba_change_direction',
								payload: { goombaKey: otherGoombaKey },
							})
						}
					}
				}
			}

			//Завершение уровня
			if (player && flagpole) {
				dispatch({
					type: 'level_completed',
				})
			}

			// ---------- BLOCKS ----------

			if (player && block) {
				const normal = pair.collision.normal
				const isJumping = player.velocity.y < -0.5
				const isHitFromBelow = normal.y > 0.5

				const dx = Math.abs(player.position.x - block.position.x)
				const isOverlappingX = dx < 25

				const isHeadHit = isJumping && isHitFromBelow && isOverlappingX

				if (isHeadHit) {
					const blockKey = Object.keys(entities).find((key) => entities[key]?.body === block)

					if (!blockKey) return

					hitBlocks.push({
						blockKey,
						blockBody: block,
						distanceX: dx,
					})
				}
			}
		})

		if (hitBlocks.length === 0) return
		hitBlocks.sort((a, b) => a.distanceX - b.distanceX)
		const bestHit = hitBlocks[0]
		if (bestHit.blockBody.label.startsWith('CoinBlock_')) {
			dispatch({
				type: 'coin_block_hit',
				payload: {
					blockKey: bestHit.blockKey,
					blockBody: bestHit.blockBody,
				},
			})
		}
		if (bestHit.blockBody.label.startsWith('Block_')) {
			dispatch({
				type: 'break_block',
				payload: {
					blockKey: bestHit.blockKey,
					blockBody: bestHit.blockBody,
				},
			})
		}
	})
}
