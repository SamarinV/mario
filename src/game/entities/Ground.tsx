import React from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import Matter from 'matter-js'

type GroundProps = {
	body: Matter.Body
	size: [number, number]
	cameraX: number
}

// Кэшируем картинку в памяти, чтобы не перегружать её на каждом кадре
const GROUND_IMAGE = require('../../../assets/images/ground.png')

export const Ground: React.FC<GroundProps> = React.memo(
	(props) => {
		const { x, y } = props.body.position
		const [width, height] = props.size

		const cameraX = props.cameraX || 0
		const left = x - width / 2 - cameraX
		const top = y - height / 2

		return (
			<ImageBackground
				source={GROUND_IMAGE}
				imageStyle={[styles.imagePattern, { height: height }]}
				style={[
					styles.container,
					{
						left,
						top,
						width,
						height,
					},
				]}
			/>
		)
	},
	(prevProps, nextProps) => {
		// Блокируем лишние ререндеры в виртуальном DOM
		return (
			prevProps.body.position.x === nextProps.body.position.x &&
			prevProps.body.position.y === nextProps.body.position.y &&
			prevProps.cameraX === nextProps.cameraX &&
			prevProps.size[0] === nextProps.size[0] &&
			prevProps.size[1] === nextProps.size[1]
		)
	},
)

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		overflow: 'hidden',
		// Добавляем коричневый цвет-подложку. Так как ImageBackground — это View,
		// наложение цвета здесь застрахует от любых микро-вспышек
		backgroundColor: '#8B4513',
	},
	imagePattern: {
		resizeMode: 'repeat', // Зацикливание текстуры по осям
		width: '100%',
		height: '100%',
	},
})
