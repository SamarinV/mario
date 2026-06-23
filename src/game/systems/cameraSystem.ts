import { Dimensions } from 'react-native'
import { EntitiesType } from './types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SCREEN_CENTER_X = SCREEN_WIDTH / 2

export const cameraSystem = (entities: EntitiesType) => {
	const { player, camera } = entities
	if (!camera || !player) return entities

	const targetCameraX = player.body.position.x - SCREEN_CENTER_X

	const levelWidth = Math.max(
		...Object.keys(entities)
			.filter((k) => k.startsWith('ground'))
			.map((k) => entities[k].body.position.x + entities[k].size[0] / 2),
		SCREEN_WIDTH,
	)

	const maxCameraX = levelWidth - SCREEN_WIDTH - 50
	camera.x = Math.max(0, Math.min(targetCameraX, maxCameraX))

	for (const key in entities) {
		if (key !== 'camera' && key !== 'physics') {
			entities[key].cameraX = camera.x
		}
	}

	return entities
}
