import React from 'react'
import { View } from 'react-native'
import Matter from 'matter-js'

type PlayerProps = {
	body: Matter.Body
	size: [number, number]
	cameraX: number
}

export const Player: React.FC<PlayerProps> = (props) => {
	const { x, y } = props.body.position
	const [width, height] = props.size
	const cameraX = props.cameraX ?? 0

	const left = x - width / 2 - cameraX
	const top = y - height / 2

	return (
		<View
			style={{
				position: 'absolute',
				left,
				top,
				width,
				height,
				backgroundColor: 'red',
			}}
		/>
	)
}
