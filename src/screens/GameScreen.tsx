import { ReactNativeJoystick } from '@korsolutions/react-native-joystick'
import React from 'react'
import { Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { RectButton } from 'react-native-gesture-handler'
import { level1 } from '../game/levels/level1'
import { Physics } from '../game/systems/Phisics'

type EngineAction =
	| { type: 'move'; x: number }
	| { type: 'stop' }
	| { type: 'jump' }
	| { type: 'respawn' }
type GameEvent = { type: 'player_fell' }
type JoystickMoveEvent = {
	position: {
		x: number
		y: number
	}
}
type Entities = typeof level1
type EngineRef = {
	dispatch: (action: EngineAction) => void
} | null

export const GameScreen = () => {
	const engineRef = React.useRef<EngineRef>(null)

	const getInitialEntities = (): Entities => {
		return level1
	}

	const handleMove = (event: JoystickMoveEvent) => {
		const engine = engineRef.current
		if (!engine) return

		// центр джойстика ≈ 50
		const dx = (event.position.x - 50) / 50

		engine.dispatch({
			type: 'move',
			x: dx,
		})
	}

	const respawnPlayer = () => {
		engineRef.current?.dispatch({
			type: 'respawn',
		})
	}

	const onEvent = (e: GameEvent) => {
		if (e.type === 'player_fell') {
			respawnPlayer()
		}
	}

	return (
		<>
			<GameEngine
				ref={engineRef as any}
				style={{ flex: 1 }}
				systems={[Physics]}
				entities={getInitialEntities()}
				onEvent={onEvent}
			/>

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
					onMove={handleMove}
					onStop={() => {
						engineRef.current?.dispatch({
							type: 'stop',
						})
					}}
				/>
			</View>

			<View
				style={{
					position: 'absolute',
					bottom: 40,
					right: 40,
					zIndex: 999,
					elevation: 999,
				}}
			>
				<RectButton
					onPress={() => {
						engineRef.current?.dispatch({
							type: 'jump',
						})
					}}
					style={{
						width: 100,
						height: 100,
						borderRadius: 50,
						backgroundColor: '#06b6d4',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text
						style={{
							color: 'white',
							fontSize: 24,
							fontWeight: 'bold',
						}}
					>
						↑
					</Text>
				</RectButton>
			</View>
		</>
	)
}
