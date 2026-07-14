// Импортируем все файлы карт уровней
import level1Map from '../maps/level1.json'
import { parseMap } from '../maps/parseMap'
import { levelFactory } from './levelFactory'

const mapsRegistry: Record<number, any> = {
	1: level1Map,
}

export const createLevel = (level: number) => {
	const selectedMap = mapsRegistry[level] || level1Map

	if (!mapsRegistry[level]) {
		console.warn(`Уровень ${level} не найден в реестре карт. Загружен уровень 1 по умолчанию.`)
	}
	const { grounds, blocks, coinBlocks, goombas, levelHeight } = parseMap(selectedMap)
	return levelFactory({
		levelHeight,
		grounds,
		blocks,
		goombas,
		coinBlocks,
		flagpoleOffsetFromEnd: 250,
	})
}
