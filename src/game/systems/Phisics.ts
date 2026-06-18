export const Physics = (entities: any, { events }: any) => {
	const player = entities.player

	events.forEach((event: any) => {
		if (event.type === 'move') {
			player.velocity.x = event.x
		}

		if (event.type === 'stop') {
			player.velocity.x = 0
		}
	})

	player.position[0] += player.velocity.x

	return entities
}
