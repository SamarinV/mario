import React from 'react'
import { View } from 'react-native'

export const CoinBlock = ({ body, size, used }: any) => {
	const width = size[0]
	const height = size[1]

	return (
		<View
			style={{
				position: 'absolute',
				left: body.position.x - width / 2,
				top: body.position.y - height / 2,
				width,
				height,
				backgroundColor: used ? '#8b5a2b' : '#f7c600',
				borderWidth: 2,
				borderColor: '#000',
			}}
		/>
	)
}
