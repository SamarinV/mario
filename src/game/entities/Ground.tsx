import React from 'react'
import { View } from 'react-native'
import Matter from 'matter-js'

type PlayerProps = {
	body: Matter.Body
	size: [number, number]
	cameraX: number
}

export const Ground: React.FC<PlayerProps> = (props) => {
	// В Matter x и y — это ЦЕНТР тела
	const { x, y } = props.body.position
	const [width, height] = props.size
	 const cameraX = props.cameraX || 0
	const left = x - width / 2 - cameraX
	const top = y - height / 2
	return (
		<View
			style={{
				position: 'absolute',
				left: left,
				top: top,
				width: width,
				height: height,
				backgroundColor: 'green',
			}}
		/>
	)
}
