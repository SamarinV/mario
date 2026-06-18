import Matter from 'matter-js'
import { Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

export const Physics = (entities: any, { events, dispatch }: any) => {
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

	// 1. СОЗДАЕМ ЛОКАЛЬНУЮ ПЕРЕМЕННУЮ ХРАНЕНИЯ СКОРОСТИ
	// Если её ещё нет в объекте игрока, инициализируем нулем
	if (player.currentMoveX === undefined) {
		player.currentMoveX = 0
	}

	// 2. Обработка input событий (Только обновляет значение, но не двигает!)
	events.forEach((event: any) => {
		if (event.type === 'move') {
			// Просто записываем текущее смещение джойстика в память игрока
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
					y: -12,
				})
			}
		}

		if (event.type === 'respawn') {
			const newX = player.body.position.x - 100
			const newY = 50
			Matter.Body.setPosition(player.body, { x: newX, y: newY })
			Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
			Matter.Body.setAngularVelocity(player.body, 0)

			player.currentMoveX = 0 // Сброс при смерти
			player.dead = false
		}
	})

	// 3. ПРИНУДИТЕЛЬНОЕ УДЕРЖАНИЕ СКОРОСТИ (Вне цикла events)
	// Этот код выполняется КАЖДЫЙ кадр игры. Даже если массив events пустой,
	// движок помнит последнее значение player.currentMoveX и заставляет тело двигаться.
	Matter.Body.setVelocity(player.body, {
		x: player.currentMoveX * 5, // Множитель скорости бега (подстройте под себя)
		y: player.body.velocity.y, // Обязательно сохраняем нативную гравитацию по Y!
	})

	// 4. Шаг симуляции Matter.js
	Matter.Engine.update(engine, 1000 / 60)

	// 5. Камера
	// console.log('camera', entities.camera)
	const camera = entities.camera
	if (camera) {
		const SCREEN_CENTER_X = 150

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
