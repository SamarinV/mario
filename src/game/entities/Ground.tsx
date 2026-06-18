import React from 'react'
import { View } from 'react-native'

export const Ground = (props: any) => {
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
