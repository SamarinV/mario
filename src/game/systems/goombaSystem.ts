import Matter from 'matter-js'
import { EngineContext, EntitiesType } from './types'

export const goombaSystem = (entities: EntitiesType, { events = [], dispatch }: EngineContext) => {
	Object.keys(entities).forEach((key) => {
		if (!key.startsWith('goomba')) return

		const goomba = entities[key]

		if (goomba.dead) return
		events.forEach((event) => {
			if (event.type === 'goomba_change_direction') {
				const goomba = entities[event.payload.goombaKey]
				goomba.state === 'walkLeft' ? (goomba.state = 'walkRight') : (goomba.state = 'walkLeft')
			}
		})
		let moveX = 0
		switch (goomba.state) {
			case 'walkLeft':
				moveX = -goomba.speed
				break

			case 'walkRight':
				moveX = goomba.speed
				break
		}
		Matter.Body.setVelocity(goomba.body, {
			x: moveX,
			y: goomba.body.velocity.y,
		})

		goomba.frameTimer++
		if (goomba.state !== 'dead' && goomba.frameTimer % 10 === 0) {
			goomba.frame = goomba.frame === 0 ? 1 : 0
		}
		if (goomba.state === 'dead') {
			goomba.frame = 2
		}
	})

	return entities
}
