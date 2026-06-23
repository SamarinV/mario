import Matter from 'matter-js'
import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { GroundEntityType } from '../systems/types'

const GROUND_IMAGE = require('../../../assets/images/ground.png')

export const Ground: React.FC<GroundEntityType> = React.memo(
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
		backgroundColor: '#8B4513',
	},
	imagePattern: {
		resizeMode: 'repeat',
		width: '100%',
		height: '100%',
	},
})
