import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { CustomJoystick, JoystickMoveEventType } from './CustomJoystick'

interface GameControlsProps {
	onMove: (event: JoystickMoveEventType) => void
	onStop: () => void
	onJump: () => void
}

export const GameControls: React.FC<GameControlsProps> = ({ onMove, onStop, onJump }) => {
	return (
		<>
			{/* Зона джойстика движения */}
			<View style={styles.joystickContainer}>
				<CustomJoystick radius={75} onMove={onMove} onStop={onStop} />
			</View>

			{/* Кнопка прыжка */}
			<View style={styles.jumpButtonContainer}>
				<RectButton onPress={onJump} style={styles.jumpButton}>
					<Text style={styles.jumpButtonText}>↑</Text>
				</RectButton>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	joystickContainer: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		zIndex: 999,
		elevation: 999,
	},
	jumpButtonContainer: {
		position: 'absolute',
		bottom: 40,
		right: 40,
		zIndex: 999,
		elevation: 999,
	},
	jumpButton: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#474747',
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0.6,
	},
	jumpButtonText: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
})
