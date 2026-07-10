import React from 'react'
import { View, Image } from 'react-native'
import { GoombaEntityType } from '../systems/types'

export const Goomba = ({ body, frame = 0 }: GoombaEntityType) => {
	const frameSize = 40
	return (
		<View
			style={{
				position: 'absolute',
				left: body.position.x - frameSize / 2,
				top: body.position.y - frameSize / 2 + 2,
				width: frameSize,
				height: frameSize,
				overflow: 'hidden',
			}}
		>
			<Image
				source={require('../../../assets/images/goomba-sprite.png')}
				style={{
					width: frameSize * 3, // 3 frames
					height: frameSize,

					transform: [
						{
							translateX: -frame * frameSize,
						},
					],
				}}
			/>
		</View>
	)
}
