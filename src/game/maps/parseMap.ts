const TILE_SIZE = 40
type Rect = { x: number; y: number; w: number; h: number }
export const parseMap = (map: any) => {
	const grounds: number[][] = []
	const blocks: Rect[] = []
	const coinBlocks: Rect[] = []

	const collisionLayer = map.layers.find((l: any) => l.name === 'Collisions')
	if (collisionLayer) {
		collisionLayer.objects.forEach((obj: any) => {
			// Одно большое физическое тело на всю длину
			grounds.push([obj.x, obj.y, obj.width, obj.height])
		})
	}

	const interactiveLayer = map.layers.find((l: any) => l.name === 'Interactive_Blocks')
	if (interactiveLayer) {
		interactiveLayer.data.forEach((tile: number, index: number) => {
			if (tile === 17) {
				// Если это кирпич
				const col = index % map.width
				const row = Math.floor(index / map.width)
				const x = col * TILE_SIZE
				const y = row * TILE_SIZE
				blocks.push({ x, y, w: TILE_SIZE, h: TILE_SIZE })
			}
			if (tile === 53) {
				// Если это блок с монетой
				const col = index % map.width
				const row = Math.floor(index / map.width)
				const x = col * TILE_SIZE
				const y = row * TILE_SIZE
				coinBlocks.push({ x, y, w: TILE_SIZE, h: TILE_SIZE })
			}
		})
	}

	return {
		grounds,
		blocks,
		coinBlocks,
		levelHeight: map.height * TILE_SIZE,
		levelWidth: map.width * TILE_SIZE,
	}
}
