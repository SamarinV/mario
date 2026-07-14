import React, { useEffect, useState } from 'react'
import { GameEngine } from 'react-native-game-engine'
import { JoystickMoveEventType } from '../components/CustomJoystick'
import { GameControls } from '../components/GameControls'
import { GameOverOverlay } from '../components/GameOverOverlay'
import { HUD } from '../components/HUD'
import { LevelCompletedOverlay } from '../components/LevelCompletedOverlay'
import { RenderLevel } from '../components/RenderLevel'
import { createLevel } from '../game/levels/createLevel'
import {
	animationSystem,
	cameraSystem,
	coinEffectSystem,
	controlSystem,
	cutsceneSystem,
	goombaSystem,
	physicsSystem,
} from '../game/systems'
import { setupEngine } from '../game/systems/setupEngine'
import { EntitiesType, PhysicsEvent } from '../game/systems/types'

type EngineRef = {
	dispatch: (action: PhysicsEvent) => void
	swap: (newEntities: EntitiesType) => void
} | null

export const GameScreen = () => {
	const engineRef = React.useRef<EngineRef>(null)
	const [hud, setHud] = useState({
		score: 0,
		coins: 0,
		lives: 3,
	})
	const [currentLevel, setCurrentLevel] = useState(1)
	const [gameKey, setGameKey] = useState(0)
	const [isGameOver, setIsGameOver] = useState(false)
	const [isLevelCompleted, setIsLevelCompleted] = useState(false)
	const [entities, setEntities] = useState<EntitiesType>(() => createLevel(currentLevel))

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
	}, [entities])

	const onEvent = (e: PhysicsEvent) => {
		if (e.type === 'player_fell') {
			respawnPlayer()
		}
		if (e.type === 'hud_update') {
			setHud(e.payload)
		}
		if (e.type === 'game_over') {
			setIsGameOver(true)
		}
		if (e.type === 'level_completed') {
			setIsLevelCompleted(true)
		}
	}
	const loadNewLevel = (levelNumber: number) => {
		const freshEntities = createLevel(levelNumber)
		setEntities(freshEntities)
		setGameKey((prev) => prev + 1)
	}

	const handleNextLevel = () => {
		const nextLevel = currentLevel + 1
		setCurrentLevel(nextLevel)
		setIsLevelCompleted(false)
		loadNewLevel(nextLevel)
	}

	const handleRestart = () => {
		setIsGameOver(false)
		setHud({ score: 0, coins: 0, lives: 3 })
		loadNewLevel(currentLevel)
	}

	return (
		<>
			<GameEngine
				key={gameKey}
				ref={engineRef as any}
				style={{ flex: 1, backgroundColor: '#73cdfa' }}
				systems={[
					controlSystem,
					animationSystem,
					cutsceneSystem,
					physicsSystem,
					cameraSystem,
					coinEffectSystem,
					goombaSystem,
				]}
				entities={entities}
				onEvent={onEvent}
				renderer={RenderLevel}
			/>
			<HUD score={hud.score} coins={hud.coins} lives={hud.lives} world="1-1" />
			{!isGameOver && (
				<>
					<GameControls
						onMove={handleMove}
						onStop={() => engineRef.current?.dispatch({ type: 'stop' })}
						onJump={() => engineRef.current?.dispatch({ type: 'jump' })}
					/>
				</>
			)}
			{isLevelCompleted && (
				<LevelCompletedOverlay currentLevel={currentLevel} onNextLevel={handleNextLevel} />
			)}
			{isGameOver && <GameOverOverlay onRestart={handleRestart} />}
		</>
	)
}
