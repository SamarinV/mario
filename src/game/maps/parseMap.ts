const TILE_SIZE = 40
type Rect = { x: number; y: number; w: number; h: number }
export const parseMap = (map: any) => {
	const grounds: number[][] = []
	const blocks: Rect[] = []
	const coinBlocks: Rect[] = []
	const goombas: Rect[] = []

	const collisionLayer = map.layers.find((l: any) => l.name === 'Collisions')
	if (collisionLayer) {
		collisionLayer.objects.forEach((obj: any) => {
			// Одно большое физическое тело на всю длину
			grounds.push([obj.x, obj.y, obj.width, obj.height])
		})
	}
	const entitiesLayer = map.layers.find((l: any) => l.name === 'Goomba')
	if (entitiesLayer) {
		entitiesLayer.data.forEach((tile: number, index: number) => {
			const col = index % map.width
			const row = Math.floor(index / map.width)
			const x = col * TILE_SIZE
			const y = row * TILE_SIZE
			// Если это goomba
			if (tile === 19) {
				goombas.push({ x, y, w: TILE_SIZE, h: TILE_SIZE })
			}
		})
	}

	const interactiveLayer = map.layers.find((l: any) => l.name === 'Interactive_Blocks')
	if (interactiveLayer) {
		interactiveLayer.data.forEach((tile: number, index: number) => {
			const col = index % map.width
			const row = Math.floor(index / map.width)
			const x = col * TILE_SIZE
			const y = row * TILE_SIZE
			// Если это кирпич
			if (tile === 17) {
				blocks.push({ x, y, w: TILE_SIZE, h: TILE_SIZE })
			}
			// Если это блок с монетой
			if (tile === 18) {
				coinBlocks.push({ x, y, w: TILE_SIZE, h: TILE_SIZE })
			}
		})
	}

	return {
		grounds,
		blocks,
		goombas,
		coinBlocks,
		levelHeight: map.height * TILE_SIZE,
		levelWidth: map.width * TILE_SIZE,
	}
}
