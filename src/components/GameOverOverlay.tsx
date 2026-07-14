import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

interface GameOverOverlayProps {
	onRestart: () => void
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ onRestart }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>GAME OVER</Text>

			<RectButton onPress={onRestart} style={styles.button}>
				<Text style={styles.buttonText}>PLAY AGAIN</Text>
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
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
		elevation: 1000,
	},
	title: {
		color: '#ff4a4a',
		fontSize: 42,
		fontWeight: 'bold',
		marginBottom: 24,
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
