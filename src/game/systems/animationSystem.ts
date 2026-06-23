import { EntitiesType } from './types'

const FRAMES_PER_ANIM = 6

export const animationSystem = (entities: EntitiesType) => {
	const { player } = entities
	if (!player) return entities

	const isJumping = Math.abs(player.body.velocity.y) > 0.1
	if (isJumping) {
		player.state = player.currentMoveX >= 0 ? 'jumpRight' : 'jumpLeft'
	} else {
		player.state =
			player.currentMoveX > 0 ? 'runRight' : player.currentMoveX < 0 ? 'runLeft' : 'idleRight'
	}

	player.frameTimer = (player.frameTimer ?? 0) + 1
	if (player.frameTimer >= FRAMES_PER_ANIM) {
		player.frameTimer = 0
		player.frame = ((player.frame ?? 0) + 1) % 4
	}

	return entities
}
