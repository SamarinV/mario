import React from 'react'
import { View } from 'react-native'

type Props = {
	body: any
	size: [number, number]
}

export const Block: React.FC<Props> = ({ body, size }) => {
	const { x, y } = body.position
	const [width, height] = size

	return (
		<View
			style={{
				position: 'absolute',
				left: x - width / 2,
				top: y - height / 2,
				width,
				height,
				backgroundColor: '#b5651d', // временно "кирпич"
				borderWidth: 1,
				borderColor: '#000',
			}}
		/>
	)
}
