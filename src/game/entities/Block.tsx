import React from 'react'
import { View } from 'react-native'
import { BlockEntityType } from '../systems/types'

export const Block: React.FC<BlockEntityType> = ({ body, size }) => {
	const { x, y } = body.position
	const [width, height] = size

	return (
		<View
			style={{
				position: 'absolute',
				left: x - width / 2,
				top: y - height / 2,
				borderRadius: 2,
				width,
				height,
				backgroundColor: '#b5651d', // временно "кирпич"
				borderWidth: 1,
				borderColor: '#000',
			}}
		/>
	)
}
