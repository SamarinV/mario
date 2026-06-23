import { Image, View } from 'react-native'

type SpriteProps = {
	source: any
	frameX: number
	frameY: number
	frameWidth: number
	frameHeight: number
	x: number
	y: number
}

export const Sprite = ({ source, frameX, frameY, frameWidth, frameHeight, x, y }: SpriteProps) => {
	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y + 5,
				width: frameWidth * 2,
				height: frameHeight + 20,
				overflow: 'hidden',
			}}
		>
			<Image
				source={source}
				style={{
					position: 'absolute',
					left: -frameX,
					top: -frameY,
					transform: [{ scale: 2 }],
				}}
			/>
		</View>
	)
}
