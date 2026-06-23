import Matter from 'matter-js'
import React from 'react'
import { View } from 'react-native'

interface FlagpoleProps {
	size: [number, number]
	body: Matter.Body
	cameraX?: number
	flagOffset?: number
}

export const Flagpole: React.FC<FlagpoleProps> = ({ size, body, cameraX = 0, flagOffset = 0 }) => {
	const [width, height] = size

	const x = body.position.x - width / 2 - cameraX
	const y = body.position.y - height / 2

	const ballSize = 24
	const poleWidth = 10

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
				alignItems: 'center',
			}}
		>
			{/* 1. Зеленый круглый наконечник */}
			<View
				style={{
					width: ballSize,
					height: ballSize,
					backgroundColor: '#249f17',
					borderRadius: ballSize / 2,
					borderWidth: 2,
					borderColor: '#000',
				}}
			/>

			{/* 2. Древко флага */}
			<View
				style={{
					flex: 1,
					width: poleWidth,
					backgroundColor: '#b87331',
					borderLeftWidth: 2,
					borderRightWidth: 2,
					borderColor: '#000',
				}}
			/>

			{/* 3. Флаг (Теперь его позиция зависит от flagOffset) */}
			<View
				style={{
					position: 'absolute',
					// Раньше тут было жестко ballSize + 10.
					// Теперь мы прибавляем flagOffset, заставляя его ехать вниз!
					top: ballSize + 10 + flagOffset,
					left: width / 2 + poleWidth / 2,
					width: 45,
					height: 35,
					backgroundColor: '#ffffff',
					borderWidth: 2,
					borderColor: '#000',
				}}
			/>
		</View>
	)
}
