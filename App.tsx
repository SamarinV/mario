import { useKeepAwake } from 'expo-keep-awake'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GameScreen } from './src/screens/GameScreen'

export default function App() {
	useKeepAwake()

	return (
		<GestureHandlerRootView>
			<GameScreen />
		</GestureHandlerRootView>
	)
}
