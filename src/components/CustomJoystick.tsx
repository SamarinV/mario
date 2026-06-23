import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

export type JoystickMoveEventType = {
	x: number
	y: number
	angle: number
}

type JoystickProps = {
	onMove: (data: JoystickMoveEventType) => void
	onStop: () => void
	radius: number
}

export const CustomJoystick: React.FC<JoystickProps> = ({ onMove, onStop, radius }) => {
	const stickRadius = radius / 2

	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const startX = useSharedValue(0)
	const startY = useSharedValue(0)

	const panGesture = Gesture.Pan()
		.onBegin(() => {
			startX.value = translateX.value
			startY.value = translateY.value
		})
		.onChange((event) => {
			const x = startX.value + event.translationX
			const y = startY.value + event.translationY

			const distance = Math.sqrt(x * x + y * y)

			if (distance < radius) {
				translateX.value = x
				translateY.value = y
			} else {
				const angle = Math.atan2(y, x)
				translateX.value = Math.cos(angle) * radius
				translateY.value = Math.sin(angle) * radius
			}

			const normalizedX = translateX.value / radius
			const normalizedY = translateY.value / radius
			const angleGrad = Math.atan2(-translateY.value, translateX.value) * (180 / Math.PI)
			const finalAngle = angleGrad < 0 ? angleGrad + 360 : angleGrad

			// ИСПРАВЛЕНИЕ: Передаем функцию и объект аргумента раздельно через запятую
			scheduleOnRN(onMove, { x: normalizedX, y: normalizedY, angle: finalAngle })
		})
		.onFinalize(() => {
			translateX.value = withSpring(0)
			translateY.value = withSpring(0)

			// ИСПРАВЛЕНИЕ: Вызываем функцию остановки через планировщик
			scheduleOnRN(onStop)
		})

	const animatedStickStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
	}))

	return (
		<View
			style={[styles.container, { width: radius * 2, height: radius * 2, borderRadius: radius }]}
		>
			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={[
						styles.stick,
						{ width: stickRadius * 2, height: stickRadius * 2, borderRadius: stickRadius },
						animatedStickStyle,
					]}
				/>
			</GestureDetector>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	stick: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
})
