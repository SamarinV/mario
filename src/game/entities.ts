import { Dimensions } from 'react-native'
import { Ground } from './entities/Ground'
import { Player } from './entities/Player'

const { width, height } = Dimensions.get('window')
export const entities = {
	player: {
		position: [200, height - 150],
		size: [50, 50],
		velocity: { x: 0, y: 0 },
		renderer: Player,
	},

	ground: {
		position: [0, height - 100],
		size: [width, 100],
		renderer: Ground,
	},
}
