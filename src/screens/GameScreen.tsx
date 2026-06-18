import { ReactNativeJoystick } from '@korsolutions/react-native-joystick'
import React from 'react'
import { Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { entities } from '../game/entities'
import { Physics } from '../game/systems/Phisics'

export const GameScreen = () => {
	const engineRef = React.useRef<any>(null)
	const handleMove = (event: any) => {
		const engine = engineRef.current
		if (!engine) return

		// центр джойстика ≈ 50
		const dx = (event.position.x - 50) / 50

		engine.dispatch({
			type: 'move',
			x: dx,
		})
	}
	return (
		<>
			<GameEngine ref={engineRef} style={{ flex: 1 }} systems={[Physics]} entities={entities} />
			<View
				style={{
					position: 'absolute',
					bottom: 20,
					left: 20,
					zIndex: 999,
					elevation: 999,
				}}
			>
				<ReactNativeJoystick
					color="#06b6d4"
					radius={75}
					onMove={(data) => handleMove(data)}
					onStop={() => {
						engineRef.current?.dispatch({
							type: 'stop',
						})
					}}
				/>
			</View>
		</>
	)
}
