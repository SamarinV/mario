import Matter from 'matter-js'
import { Debris } from '../entities/Debris'

export const createBlockDebris = (entities: any, world: Matter.World, x: number, y: number) => {
	const velocities = [
		{ x: -3, y: -8 },
		{ x: 3, y: -8 },
		{ x: -2, y: -5 },
		{ x: 2, y: -5 },
	]

	velocities.forEach((velocity, index) => {
		const body = Matter.Bodies.rectangle(x, y, 12, 12, {
			restitution: 0,
		})

		Matter.Body.setVelocity(body, velocity)

		Matter.World.add(world, body)

		entities[`debris_${Date.now()}_${index}`] = {
			body,
			size: [12, 12],
			life: 45,
			renderer: Debris,
		}
	})
}
