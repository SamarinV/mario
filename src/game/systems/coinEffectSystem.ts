export const coinEffectSystem = (entities: any) => {
	Object.keys(entities).forEach((key) => {
		if (!key.startsWith('coin_fx_')) return

		const coin = entities[key]

		coin.y -= 1

		coin.life--

		if (coin.life <= 0) {
			delete entities[key]
		}
	})

	return entities
}
