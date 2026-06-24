import { Dimensions } from 'react-native'
import { createLevel } from './levelFactory'
import level1Map from '../maps/level1.json'
import { parseMap } from '../maps/parseMap'

const { height } = Dimensions.get('window')
const { grounds, blocks, levelHeight, levelWidth } = parseMap(level1Map)

export const level1 = createLevel({
	levelHeight,

	grounds: grounds,
	blocks: blocks,

	flagpoleOffsetFromEnd: 250,
})
