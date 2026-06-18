import React from 'react'
import { View } from 'react-native'

type PlayerProps = {
	position: [number, number]
	size: [number, number]
}

export const Player = ({ position, size }: PlayerProps) => {
	return (
		<View
			style={{
				position: 'absolute',
				left: position[0],
				top: position[1],
				width: size[0],
				height: size[1],
				backgroundColor: 'red',
			}}
		/>
	)
}
