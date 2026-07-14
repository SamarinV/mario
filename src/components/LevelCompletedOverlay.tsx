import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

interface LevelCompletedOverlayProps {
	currentLevel: number
	onNextLevel: () => void
}

export const LevelCompletedOverlay: React.FC<LevelCompletedOverlayProps> = ({
	currentLevel,
	onNextLevel,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>STAGE CLEAR!</Text>
			<Text style={styles.subtitle}>You completed World 1-{currentLevel}</Text>

			<RectButton onPress={onNextLevel} style={styles.button}>
				<Text style={styles.buttonText}>NEXT LEVEL</Text>
			</RectButton>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.85)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
		elevation: 1000,
	},
	title: {
		color: '#4eff4a', // Зеленый праздничный цвет
		fontSize: 42,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		color: '#ffffff',
		fontSize: 20,
		marginBottom: 32,
	},
	button: {
		backgroundColor: '#ffffff',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	buttonText: {
		color: '#000000',
		fontSize: 18,
		fontWeight: 'bold',
	},
})
