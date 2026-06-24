// game/renderers/renderScene.tsx

import React from 'react'
import { View } from 'react-native'

export const RenderLevel = (entities: any) => {
	if (!entities) return null

	const cameraX = entities.camera?.x ?? 0

	const renderableKeys = Object.keys(entities).filter(
		(key) => key !== 'physics' && key !== 'camera' && entities[key] && entities[key].renderer,
	)

	return (
		<View
			style={{
				flex: 1,
				overflow: 'hidden',
			}}
		>
			<View
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					transform: [{ translateX: -cameraX }],
				}}
			>
				{renderableKeys.map((key) => {
					const entity = entities[key]
					const Renderer = entity.renderer

					return <Renderer key={key} {...entity} />
				})}
			</View>
		</View>
	)
}
