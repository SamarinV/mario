import React from 'react'
import { View } from 'react-native'

type GroundProps = {
	position: [number, number]
	size: [number, number]
}

export const Ground = ({ position, size }: GroundProps) => {
	const width = size[0]
	const height = size[1]

	const x = position[0]
	const y = position[1]

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width,
				height,
				backgroundColor: 'green',
			}}
		/>
	)
}
