import { Dimensions } from 'react-native'
import { createLevel } from './levelFactory'

const { height } = Dimensions.get('window')

export const level1 = createLevel({
	playerStart: { x: 120, y: height - 150 },

	grounds: [
		// стартовая земля
		[0, height - 50, 700, 50],

		// разрыв
		[850, height - 50, 600, 50],

		// средняя зона
		[1600, height - 50, 800, 50],

		// финальная зона
		[2600, height - 50, 1200, 50],
	],

	blocks: [
		// 🟫 стартовый "разогрев"
		{ x: 250, y: height - 170, w: 40, h: 40 },
		{ x: 290, y: height - 170, w: 40, h: 40 },
		{ x: 330, y: height - 170, w: 40, h: 40 },

		// 🟫 прыжок через яму
		{ x: 750, y: height - 170, w: 40, h: 40 },
		{ x: 790, y: height - 220, w: 40, h: 40 },

		// 🟫 парящая платформа (нужно прыгнуть)
		{ x: 1050, y: height - 260, w: 40, h: 40 },
		{ x: 1090, y: height - 260, w: 40, h: 40 },
		{ x: 1130, y: height - 260, w: 40, h: 40 },

		// 🟫 лестница вверх-вниз
		{ x: 1300, y: height - 200, w: 40, h: 40 },
		{ x: 1340, y: height - 240, w: 40, h: 40 },
		{ x: 1380, y: height - 280, w: 40, h: 40 },

		// 🟫 “ловушка” — высокий прыжок
		{ x: 1750, y: height - 300, w: 40, h: 40 },
		{ x: 1790, y: height - 300, w: 40, h: 40 },

		// 🟫 длинный мост
		{ x: 2000, y: height - 220, w: 40, h: 40 },
		{ x: 2040, y: height - 220, w: 40, h: 40 },
		{ x: 2080, y: height - 220, w: 40, h: 40 },
		{ x: 2120, y: height - 220, w: 40, h: 40 },
		{ x: 2160, y: height - 220, w: 40, h: 40 },

		// 🟫 финальная подготовка к замку
		{ x: 2400, y: height - 180, w: 40, h: 40 },
		{ x: 2440, y: height - 220, w: 40, h: 40 },
		{ x: 2480, y: height - 260, w: 40, h: 40 },
	],

	flagpoleOffsetFromEnd: 250,
})
