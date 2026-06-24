import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { Ground } from '../entities/Ground'
import { Player } from '../entities/Player'
import { EntitiesType } from '../systems/types'
import { Flagpole } from '../../components/Flagpole'
import { Castle } from '../../components/Castle'

const { height } = Dimensions.get('window')
type Rect = { x: number; y: number; w: number; h: number }
interface LevelConfig {
	playerStart: { x: number; y: number }
	grounds: number[][]
	blocks: Rect[]
	flagpoleOffsetFromEnd?: number
}

export const createLevel = (config: LevelConfig): EntitiesType => {
	const engine = Matter.Engine.create({ enableSleeping: false })
	const world = engine.world
	engine.gravity.y = 1.2

	const levelWidth = Math.max(...config.grounds.map(([x, , w]) => x + w))

	const createStatic = (rect: Rect, label: string) => {
		const body = Matter.Bodies.rectangle(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h, {
			isStatic: true,
			label,
		})

		Matter.World.add(world, body)

		return body
	}
	//Игрок
	const playerBody = Matter.Bodies.rectangle(config.playerStart.x, config.playerStart.y, 20, 60, {
		label: 'Player',
		inertia: Infinity,
	})

	//Земля
	const groundEntities: Record<string, any> = {}
	config.grounds.forEach((item, index) => {
		const [x, y, w, h] = item
		const centerX = x + w / 2
		const centerY = y + h / 2
		const body = Matter.Bodies.rectangle(centerX, centerY, w, h, {
			isStatic: true,
			label: `Ground_${index}`,
		})
		Matter.World.add(world, [body])

		groundEntities[`ground${index}`] = {
			body,
			size: [w, h],
			renderer: Ground,
		}
	})

	//Стены
	const wallThickness = 300
	const leftWall = Matter.Bodies.rectangle(
		-wallThickness / 2,
		height / 2,
		wallThickness,
		height * 2,
		{ isStatic: true },
	)
	const rightWall = Matter.Bodies.rectangle(
		levelWidth + wallThickness / 2,
		height / 2,
		wallThickness,
		height * 2,
		{ isStatic: true },
	)

	// Флагшток
	const flagWidth = 40
	const flagHeight = 300
	const offset = config.flagpoleOffsetFromEnd ?? 350
	const flagpoleBody = Matter.Bodies.rectangle(
		levelWidth - offset,
		height - 50 - flagHeight / 2,
		flagWidth,
		flagHeight,
		{
			label: 'Flagpole',
			isStatic: true,
			isSensor: true,
		},
	)

	//Замок
	const castleWidth = 200
	const castleHight = 170
	const castleX = levelWidth - 50 - castleWidth / 2
	const castleY = height - 50 - castleHight / 2
	const castleBody = Matter.Bodies.rectangle(castleX, castleY, castleWidth, castleHight, {
		label: 'Castle',
		isStatic: true,
		isSensor: true,
	})

	// ---------------- BLOCKS ----------------
	const blockEntities: Record<string, any> = {};
	(config.blocks ?? []).forEach((b, i) => {
		const body = createStatic(b, `Block_${i}`)

		blockEntities[`block_${i}`] = {
			body,
			size: [b.w, b.h],
			renderer: require('../entities/Block').Block,
		}
	})

	Matter.World.add(world, [flagpoleBody, leftWall, rightWall, playerBody, castleBody])

	return {
		physics: { engine, world },
		camera: { x: 0 },

		flagpole: {
			body: flagpoleBody,
			size: [flagWidth, flagHeight],
			flagOffset: 0,
			isLowering: false,
			isWalkingToCastle: false,
			renderer: Flagpole,
		},
		castle: {
			body: castleBody,
			size: [castleWidth, castleHight],
			renderer: Castle,
		},
		player: {
			body: playerBody,
			size: [50, 70],
			velocity: { x: 0, y: 0 },
			currentMoveX: 0,
			dead: false,
			renderer: Player,
			sprite: require('../../../assets/images/mariro-sprite.png'),
			state: 'idleRight',
			frame: 0,
			frameTimer: 0,
		},
		leftWall: { body: leftWall, render: { visible: false } },
		rightWall: { body: rightWall, render: { visible: false } },
		...groundEntities,
		...blockEntities,
	}
}
