import React from 'react'
import { Image } from 'react-native'

export const Coin = ({ x, y }: any) => {
	return (
		<Image
			source={require('../../../assets/images/coin.png')}
			style={{
				position: 'absolute',
				left: x - 12,
				top: y - 12,
				width: 24,
				height: 24,
			}}
		/>
	)
}
