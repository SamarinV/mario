import Matter from 'matter-js'
import React from 'react'
import { Sprite } from '../../components/Sprite'

// Define the exact shape of an animation coordinate frame
interface AnimationFrame {
	x: number
	y: number
}

// Strictly type the allowed animation states using object keys
const animations = {
	test: [{ x: 232, y: -70 }],
	idleLeftRight: [
		{ x: 75, y: -70 },
		{ x: 115, y: -70 },
	],
	runLeft: [
		{ x: 40, y: -70 },
		{ x: 0, y: -70 },
	],
	runRight: [
		{ x: 150, y: -70 },
		{ x: 191, y: -70 },
	],
	jumpLeftRight: [
		{ x: -40, y: -70 },
		{ x: 232, y: -70 },
	],
} as const

// Extract the valid state strings dynamically from the animations object
type AnimationState = keyof typeof animations

type PlayerProps = {
	body: Matter.Body
	size: [number, number]
	cameraX: number
	sprite: string | HTMLImageElement // Replaced 'any' with explicit asset types
	state: AnimationState // Enforces type-safety for incoming player states
	frame: number
	frameTimer: number
}

export const Player: React.FC<PlayerProps> = ({
	body,
	size,
	cameraX = 0,
	sprite,
	state,
	frame,
}) => {
	// Destructure positioning logic directly
	const { x, y } = body.position
	const [width, height] = size

	const left = x - width / 2 - cameraX
	const top = y - height / 2

	// Fallback safe reference to the active animation list
	const activeAnimation: readonly AnimationFrame[] = animations[state] ?? animations.test

	// Calculate current active frame coordinates cleanly without mutations
	let currentFrame: AnimationFrame

	if (state === 'runLeft' || state === 'runRight') {
		const frameIndex = frame % activeAnimation.length
		currentFrame = activeAnimation[frameIndex]
	} else {
		currentFrame = activeAnimation[0] ?? { x: 0, y: 0 }
	}

	return (
		<Sprite
			source={sprite}
			frameX={currentFrame.x}
			frameY={currentFrame.y}
			frameWidth={20}
			frameHeight={40}
			x={left}
			y={top}
		/>
	)
}
