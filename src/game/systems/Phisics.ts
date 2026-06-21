import Matter from 'matter-js'
import { Dimensions } from 'react-native'

type PhysicsEvent =
	| { type: 'move'; x: number }
	| { type: 'stop' }
	| { type: 'jump' }
	| { type: 'respawn' }
	| { type: 'player_fell' }

type EngineContext = {
	events: PhysicsEvent[]
	dispatch: (event: PhysicsEvent) => void
}

type Body = Matter.Body

type PlayerEntity = {
	body: Body
	currentMoveX: number
	dead: boolean
	cameraX?: number
	sprite: any
	state: string
	frame: number
	frameTimer: number
}

type CameraEntity = {
	x: number
}

type PhysicsEntity = {
	engine: Matter.Engine
}

type Entities = {
	physics: PhysicsEntity
	player: PlayerEntity
	camera: CameraEntity
	[key: string]: any
}

const { height } = Dimensions.get('window')

export const Physics = (entities: Entities, { events, dispatch }: EngineContext): Entities => {
	const engine = entities.physics.engine
	const player = entities.player

	// --- ОТКЛЮЧЕНИЕ ВСЕХ ТИПОВ ТРЕНИЯ И ИНЕРЦИИ ---
	if (player.body && player.body.friction !== 0) {
		player.body.friction = 0 // Трение скольжения о поверхности
		player.body.frictionStatic = 0 // Трение покоя (чтобы не залипал на углах)
		player.body.frictionAir = 0 // Сопротивление воздуха (убирает плавное затухание)
	}

	// Отключаем трение, чтобы персонаж не тормозил сам по себе
	if (player.body && player.body.friction === undefined) {
		player.body.friction = 0
		player.body.frictionAir = 0
	}
	if (player.currentMoveX === undefined) {
		player.currentMoveX = 0
	}

	// 2. Обработка событий
	events.forEach((event: any) => {
		if (event.type === 'move') {
			player.currentMoveX = event.x
		}

		if (event.type === 'stop') {
			// Палец сняли — сбрасываем скорость в ноль
			player.currentMoveX = 0
			// Мгновенно гасим скорость физического тела в момент отпускания джойстика
			Matter.Body.setVelocity(player.body, { x: 0, y: player.body.velocity.y })
		}

		if (event.type === 'jump') {
			if (Math.abs(player.body.velocity.y) < 0.1) {
				Matter.Body.setVelocity(player.body, {
					x: player.body.velocity.x,
					y: -10,
				})
			}
		}

		if (event.type === 'respawn') {
			const newX = player.body.position.x - 100
			const newY = 250
			Matter.Body.setPosition(player.body, { x: newX, y: newY })
			Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
			Matter.Body.setAngularVelocity(player.body, 0)

			player.currentMoveX = 0 // Сброс при смерти
			player.dead = false
		}
	})

	// анимации
	const isJumping = Math.abs(player.body.velocity.y) > 0.1
	if (isJumping) {
		player.state = 'jumpLeftRight'
	} else if (player.currentMoveX > 0) {
		player.state = 'runRight'
	} else if (player.currentMoveX < 0) {
		player.state = 'runLeft'
	} else {
		player.state = 'idleLeftRight'
	}
	//переключение кадров
	const FRAMES_PER_ANIM = 6
	player.frameTimer += 1
	if (player.frameTimer >= FRAMES_PER_ANIM) {
		player.frameTimer = 0
		player.frame = (player.frame + 1) % 4 // допустим 4 кадра
	}

	// 3. ПРИНУДИТЕЛЬНОЕ УДЕРЖАНИЕ СКОРОСТИ (Вне цикла events)
	Matter.Body.setVelocity(player.body, {
		x: player.currentMoveX * 5, // скорость бега
		y: player.body.velocity.y, // гравитация
	})

	// 4. Шаг симуляции Matter.js
	Matter.Engine.update(engine, 1000 / 60)

	// 5. Камера
	const camera = entities.camera
	if (camera) {
		const SCREEN_CENTER_X = 350

		camera.x = Math.max(0, player.body.position.x - SCREEN_CENTER_X)
	}
	// Передаём cameraX всем рендерящимся объектам
	Object.keys(entities).forEach((key) => {
		const entity = entities[key]

		// пропускаем служебные сущности
		if (key === 'camera' || key === 'physics') return

		entity.cameraX = camera.x
	})

	// 6. Проверка падения
	if (player.body.position.y > height && !player.dead) {
		player.dead = true
		dispatch({ type: 'player_fell' })
	}

	return entities
}
