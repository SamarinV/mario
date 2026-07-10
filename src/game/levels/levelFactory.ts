import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { Ground } from '../entities/Ground'
import { Player } from '../entities/Player'
import { EntitiesType } from '../systems/types'
import { Flagpole } from '../entities/Flagpole'
import { Castle } from '../entities/Castle'

const { height: screenHeight } = Dimensions.get('window')
type Rect = { x: number; y: number; w: number; h: number }
interface LevelConfig {
	grounds: number[][]
	blocks: Rect[]
	coinBlocks?: Rect[]
	levelHeight: number
	flagpoleOffsetFromEnd?: number
	goombas: Rect[]
}

export const levelFactory = (config: LevelConfig): EntitiesType => {
	const engine = Matter.Engine.create({ enableSleeping: false })
	const world = engine.world
	engine.gravity.y = 1.2

	const levelWidth = Math.max(...config.grounds.map(([x, , w]) => x + w))
	const PLAYER = { x: 120, y: config.levelHeight - 150, width: 25, height: 60, radius: 15 }

	const createStatic = (rect: Rect, label: string) => {
		const body = Matter.Bodies.rectangle(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h, {
			isStatic: true,
			label,
		})

		Matter.World.add(world, body)

		return body
	}
	//Игрок
	const mainBody = Matter.Bodies.rectangle(
		PLAYER.x,
		PLAYER.y,
		PLAYER.width,
		PLAYER.height - PLAYER.width,
		{ label: 'Player_Core' },
	)

	// 2. Создаем верхний круг (смещаем вверх от центра)
	const topBody = Matter.Bodies.circle(
		PLAYER.x,
		PLAYER.y - (PLAYER.height / 2 - PLAYER.radius),
		PLAYER.radius,
		{
			label: 'Player_Top',
		},
	)

	// 3. Создаем нижний круг (смещаем вниз от центра)
	const bottomBody = Matter.Bodies.circle(
		PLAYER.x,
		PLAYER.y + (PLAYER.height / 2 - PLAYER.radius),
		PLAYER.radius,
		{ label: 'Player_Bottom' },
	)
	const playerBody = Matter.Body.create({
		parts: [mainBody, topBody, bottomBody],
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
		config.levelHeight / 2,
		wallThickness,
		config.levelHeight * 2,
		{ isStatic: true },
	)
	const rightWall = Matter.Bodies.rectangle(
		levelWidth + wallThickness / 2,
		config.levelHeight / 2,
		wallThickness,
		config.levelHeight * 2,
		{ isStatic: true },
	)

	// Флагшток
	const flagWidth = 40
	const flagHeight = 300
	const offset = config.flagpoleOffsetFromEnd ?? 350
	const flagpoleBody = Matter.Bodies.rectangle(
		levelWidth - offset,
		config.levelHeight - 40 - flagHeight / 2,
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
	const castleY = config.levelHeight - 40 - castleHight / 2
	const castleBody = Matter.Bodies.rectangle(castleX, castleY, castleWidth, castleHight, {
		label: 'Castle',
		isStatic: true,
		isSensor: true,
	})

	// ---------------- BLOCKS ----------------
	const blockEntities: Record<string, any> = {}
	;(config.blocks ?? []).forEach((b, i) => {
		const body = createStatic(b, `Block_${i}`)

		blockEntities[`block_${i}`] = {
			body,
			size: [b.w, b.h],
			renderer: require('../entities/Block').Block,
		}
	})

	// ---------------- COIN BLOCKS ----------------
	const coinBlockEntities: Record<string, any> = {}
	;(config.coinBlocks ?? []).forEach((b, i) => {
		const body = Matter.Bodies.rectangle(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, {
			isStatic: true,
			label: `CoinBlock_${i}`,
		})

		Matter.World.add(world, body)

		coinBlockEntities[`coinBlock_${i}`] = {
			body,
			size: [b.w, b.h],
			renderer: require('../entities/CoinBlock').CoinBlock,
			used: false,
		}
	})

	//Goomba
	const goombaEntities: Record<string, any> = {}
	;(config.goombas ?? []).forEach((b, i) => {
		const body = Matter.Bodies.rectangle(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, {
			label: `Goomba_${i}`,
			friction: 0,
		})
		Matter.World.add(world, body)

		goombaEntities[`goomba${i}`] = {
			body,
			size: [b.w, b.h],
			state: 'walkLeft',
			direction: -1,
			speed: 0.5,
			frame: 0,
			frameTimer: 0,
			dead: false,
			renderer: require('../entities/Goomba').Goomba,
		}
	})

	Matter.World.add(world, [flagpoleBody, leftWall, rightWall, playerBody, castleBody])

	return {
		physics: { engine, world, levelHeight: config.levelHeight },
		camera: { x: 0, y: config.levelHeight - screenHeight },

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
			score: 0,
			coins: 0,
			lives: 3,
		},
		leftWall: { body: leftWall, render: { visible: false } },
		rightWall: { body: rightWall, render: { visible: false } },
		...groundEntities,
		...blockEntities,
		...coinBlockEntities,
		...goombaEntities,
	}
}
