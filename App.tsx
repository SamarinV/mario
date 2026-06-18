import { useKeepAwake } from 'expo-keep-awake'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GameScreen } from './src/screens/GameScreen'
import * as ScreenOrientation from 'expo-screen-orientation'

export default function App() {
	useKeepAwake()

	  useEffect(() => {
			async function lockOrientation() {
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
			}
			lockOrientation()
			return () => {
				ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
			}
		}, [])
	return (
		<GestureHandlerRootView>
			<GameScreen />
		</GestureHandlerRootView>
	)
}
