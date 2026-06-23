import React from 'react'
import { Sprite } from '../../components/Sprite'
import { PlayerEntityType } from '../systems/types'

type AnimationFrame = {
	x: number
	y: number
}

const animations = {
	idleLeft: [{ x: 75, y: -70 }],
	idleRight: [{ x: 115, y: -70 }],
	runLeft: [
		{ x: 40, y: -70 },
		{ x: 0, y: -70 },
	],
	runRight: [
		{ x: 150, y: -70 },
		{ x: 191, y: -70 },
	],
	jumpLeft: [{ x: -40, y: -70 }],
	jumpRight: [{ x: 232, y: -70 }],
} as const

export const Player: React.FC<PlayerEntityType> = ({
	body,
	size,
	cameraX = 0,
	sprite,
	state,
	frame,
}) => {
	const { x, y } = body.position
	const [width, height] = size
	const left = x - width / 2 - cameraX
	const top = y - height / 2
	const activeAnimation: readonly AnimationFrame[] = animations[state] ?? animations.idleRight
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
