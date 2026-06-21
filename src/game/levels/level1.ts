import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { Ground } from '../entities/Ground'
import { Player } from '../entities/Player'

const { width, height } = Dimensions.get('window')

const engine = Matter.Engine.create({ enableSleeping: false })
const world = engine.world
engine.gravity.y = 1.2

const playerBody = Matter.Bodies.rectangle(500, 500, 20, 60, {
	label: 'Player',
	inertia: Infinity,
})
Matter.World.add(world, [playerBody])

// Земли [X_левый_угол, Y_верхний_угол, ширина, высота]
// длина только кратная
const groundsConfig = [
	[0, height - 50, 400, 50],
	[0, height - 150, 50, 50],
	[500, height - 50, 600, 50],
	[600, height - 300, 200, 50],
	[650, height - 180, 600, 50],
]

// Земли
const groundEntities: any = {}

// Создание земели
groundsConfig.forEach((config, index) => {
	const [x, y, w, h] = config
	const centerX = x + w / 2
	const centerY = y + h / 2
	const body = Matter.Bodies.rectangle(centerX, centerY, w, h, {
		isStatic: true,
		label: `Ground_${index}`,
	})
	Matter.World.add(world, [body])
	groundEntities[`ground${index}`] = {
		body: body,
		size: [w, h],
		renderer: Ground,
	}
})

// Стены
const wallThickness = 300
const levelWidth = Math.max(...groundsConfig.map(([x, , w]) => x + w))
const rightWallX = levelWidth + wallThickness / 2

const leftWall = Matter.Bodies.rectangle(
	-wallThickness / 2,
	height / 2,
	wallThickness,
	height * 2,
	{ isStatic: true },
)
const rightWall = Matter.Bodies.rectangle(rightWallX, height / 2, wallThickness, height * 2, {
	isStatic: true,
})
Matter.World.add(world, [leftWall, rightWall])

export const level1 = {
	physics: { engine, world },
	camera: {
		x: 0,
	},
	player: {
		body: playerBody,
		size: [50, 70],
		velocity: { x: 0, y: 0 },
		dead: false,
		renderer: Player,
		sprite: require('../../../assets/images/mariro-sprite.png'),

		state: 'test' as 'test' | 'idle' | 'run' | 'jump',
		frame: 0,
		frameTimer: 0,
	},
	leftWall: { body: leftWall, render: { visible: false } },
	rightWall: { body: rightWall, render: { visible: false } },
	...groundEntities,
}
