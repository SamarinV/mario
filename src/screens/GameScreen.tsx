import React from 'react'
import { Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { RectButton } from 'react-native-gesture-handler'
import { CustomJoystick, JoystickMoveEventType } from '../components/CustomJoystick'
import { level1 } from '../game/levels/level1'
import { PhysicsEvent } from '../game/systems/types'
import {
	animationSystem,
	cameraSystem,
	controlSystem,
	cutsceneSystem,
	physicsSystem,
} from '../game/systems'

type Entities = typeof level1
type EngineRef = {
	dispatch: (action: PhysicsEvent) => void
} | null

export const GameScreen = () => {
	const engineRef = React.useRef<EngineRef>(null)

	const getInitialEntities = (): Entities => {
		return level1
	}

	const handleMove = (event: JoystickMoveEventType) => {
		const engine = engineRef.current
		if (!engine) return
		engine.dispatch({
			type: 'move',
			x: event.x,
		})
	}

	const respawnPlayer = () => {
		engineRef.current?.dispatch({
			type: 'respawn',
		})
	}

	const onEvent = (e: PhysicsEvent) => {
		if (e.type === 'player_fell') {
			respawnPlayer()
		}
	}

	return (
		<>
			<GameEngine
				ref={engineRef as any}
				style={{ flex: 1, backgroundColor: '#73cdfa' }}
				systems={[controlSystem, animationSystem, cutsceneSystem, physicsSystem, cameraSystem]}
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
				<CustomJoystick
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
						backgroundColor: '#474747',
						justifyContent: 'center',
						alignItems: 'center',
						opacity: 0.6,
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
