import Matter from 'matter-js'
import { EntitiesType } from '../systems/types'

export const setupEngine = (
	engine: Matter.Engine,
	entities: EntitiesType,
	dispatch: (event: any) => void,
) => {
	Matter.Events.on(engine, 'collisionStart', (event) => {
		const hitBlocks: Array<{
			blockKey: string
			blockBody: Matter.Body
			distanceX: number
		}> = []

		event.pairs.forEach((pair) => {
			const { bodyA, bodyB } = pair

			const isPlayerA = bodyA.label === 'Player' || bodyA.parent?.label === 'Player'

			const isPlayerB = bodyB.label === 'Player' || bodyB.parent?.label === 'Player'

			const blockBody =
				bodyA.label.startsWith('Block_') || bodyA.label.startsWith('CoinBlock_')
					? bodyA
					: bodyB.label.startsWith('Block_') || bodyB.label.startsWith('CoinBlock_')
						? bodyB
						: null

			const playerBody = isPlayerA
				? bodyA.parent || bodyA
				: isPlayerB
					? bodyB.parent || bodyB
					: null

			if (!playerBody || !blockBody) return

			const isBlockAbove = blockBody.position.y < playerBody.position.y

			if (isBlockAbove && playerBody.velocity.y <= 0.1) {
				const blockKey = Object.keys(entities).find((key) => entities[key]?.body === blockBody)

				if (!blockKey) return

				hitBlocks.push({
					blockKey,
					blockBody,
					distanceX: Math.abs(playerBody.position.x - blockBody.position.x),
				})
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
			return
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
