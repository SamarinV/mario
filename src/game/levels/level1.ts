import level1Map from '../maps/level1.json'
import { parseMap } from '../maps/parseMap'
import { levelFactory } from './levelFactory'

const { grounds, blocks, coinBlocks, goombas, levelHeight } = parseMap(level1Map)

export const level1 = levelFactory({
	levelHeight,

	grounds,
	blocks,
	goombas,
	coinBlocks,

	flagpoleOffsetFromEnd: 250,
})
