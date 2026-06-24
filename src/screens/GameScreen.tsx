import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { RectButton } from 'react-native-gesture-handler'
import { CustomJoystick, JoystickMoveEventType } from '../components/CustomJoystick'
import { RenderLevel } from '../components/RenderLevel'
import { level1 } from '../game/levels/level1'
import {
	animationSystem,
	cameraSystem,
	controlSystem,
	cutsceneSystem,
	physicsSystem,
	coinEffectSystem,
} from '../game/systems'
import { setupEngine } from '../game/systems/setupEngine'
import { PhysicsEvent } from '../game/systems/types'
import { HUD } from '../components/HUD'

type Entities = typeof level1
type EngineRef = {
	dispatch: (action: PhysicsEvent) => void
} | null

export const GameScreen = () => {
	const engineRef = React.useRef<EngineRef>(null)
	const [hud, setHud] = useState({
		score: 0,
		coins: 0,
		lives: 3,
	})

	const getInitialEntities = (): Entities => {
		return level1
	}
	const entities = getInitialEntities()

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

	useEffect(() => {
		if (!entities) return

		setupEngine(entities.physics.engine, entities, (event) => engineRef.current?.dispatch(event))
	}, [])

	const onEvent = (e: PhysicsEvent) => {
		if (e.type === 'player_fell') {
			respawnPlayer()
		}
		if (e.type === 'hud_update') {
			setHud(e.payload)
		}
	}

	return (
		<>
			<GameEngine
				ref={engineRef as any}
				style={{ flex: 1, backgroundColor: '#73cdfa' }}
				systems={[
					controlSystem,
					animationSystem,
					cutsceneSystem,
					physicsSystem,
					cameraSystem,
					coinEffectSystem,
				]}
				entities={entities}
				onEvent={onEvent}
				renderer={RenderLevel}
			/>
			<HUD score={hud.score} coins={hud.coins} lives={hud.lives} world="1-1" />
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
