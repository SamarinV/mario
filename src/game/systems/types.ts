import Matter from 'matter-js'

export type PhysicsEvent =
	| { type: 'move'; x: number }
	| { type: 'stop' }
	| { type: 'jump' }
	| { type: 'respawn' }
	| { type: 'player_fell' }
	| { type: 'level_completed' }

export type EngineContext = {
	events: PhysicsEvent[]
	dispatch: (event: PhysicsEvent) => void
}

export type PlayerEntityType = {
	body: Matter.Body
	size: [number, number]
	velocity: { x: number; y: number }
	currentMoveX: number
	dead: boolean
	cameraX?: number
	sprite: any
	state: 'idleRight' | 'idleRight' | 'runRight' | 'runLeft' | 'jumpRight' | 'jumpLeft'
	frame: number
	frameTimer: number
	renderer: any
	isCutscene?: boolean
	hidden?: boolean
}

export type FlagpoleEntityType = {
	body: Matter.Body
	size: [number, number]
	renderer: any
	flagOffset: number
	isLowering: boolean
	isWalkingToCastle: boolean
	cameraX?: number
}
export type GroundEntityType = {
	body: Matter.Body
	size: [number, number]
	cameraX: number
}

export type EntitiesType = {
	physics: { engine: Matter.Engine; world: Matter.World, levelHeight: number }
	camera: { x: number, y: number }
	player: PlayerEntityType
	flagpole?: FlagpoleEntityType
	castle?: { body: Matter.Body; size: [number, number]; renderer: any; cameraX?: number }
	leftWall: { body: Matter.Body; render: { visible: boolean } }
	rightWall: { body: Matter.Body; render: { visible: boolean } }
	[key: string]: any
}
