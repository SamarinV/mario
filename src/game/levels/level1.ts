import { Dimensions } from 'react-native'
import { createLevel } from './levelFactory'

const { height } = Dimensions.get('window')

export const level1 = createLevel({
	playerStart: { x: 500, y: 500 },
	grounds: [
		[0, height - 50, 800, 50],
		[900, height - 50, 1400, 50],
	],
	flagpoleOffsetFromEnd: 350,
})
