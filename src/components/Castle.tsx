import React from 'react'
import { Image } from 'react-native'

interface FlagpoleProps {
	size: [number, number] // Массив из двух чисел: [ширина, высота]
	body: Matter.Body // Физическое тело Matter.js
}
export const Castle: React.FC<FlagpoleProps> = ({ size, body }) => {
	const [width, height] = size
	const x = body.position.x - width / 2
	const y = body.position.y - height / 2

	return (
		<Image
			source={require('../../assets/images/castle.png')}
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
			}}
		></Image>
	)
}
