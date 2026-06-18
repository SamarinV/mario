import Matter from 'matter-js'
import { Dimensions } from 'react-native'
import { Ground } from '../entities/Ground'
import { Player } from '../entities/Player'

const { width, height } = Dimensions.get('window')

const engine = Matter.Engine.create({ enableSleeping: false })
const world = engine.world
engine.gravity.y = 1.2

const playerBody = Matter.Bodies.rectangle(100, 100, 50, 50, {
	label: 'Player',
	inertia: Infinity,
})
Matter.World.add(world, [playerBody])

// Земли [X_левый_угол, Y_верхний_угол, ширина, высота]
const groundsConfig = [
	[0, height - 100, 250, 100],
	[350, height - 150, 150, 50],
	[600, height - 200, 2000, 50],
	[900, height - 100, 300, 100],
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
		size: [50, 50],
		velocity: { x: 0, y: 0 },
		dead: false,
		renderer: Player,
	},
	leftWall: { body: leftWall, render: { visible: false } },
	rightWall: { body: rightWall, render: { visible: false } },
	...groundEntities,
}
