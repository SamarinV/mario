import level1Map from '../maps/level1.json'
import { parseMap } from '../maps/parseMap'
import { createLevel } from './levelFactory'

const { grounds, blocks, coinBlocks, levelHeight } = parseMap(level1Map)

export const level1 = createLevel({
	levelHeight,

	grounds: grounds,
	blocks: blocks,
	coinBlocks,

	flagpoleOffsetFromEnd: 250,
})
