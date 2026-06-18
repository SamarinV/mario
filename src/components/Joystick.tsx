// import { ReactNativeJoystick } from '@korsolutions/react-native-joystick'
// import React from 'react'
// import { View } from 'react-native'
// import Joystick from 'react-native-joystick-controller'

// type Props = {
// 	onMove: (x: number, y: number) => void
// }

// export const GameJoystick = ({ onMove }: Props) => {
// 	return (
// 		<View style={{ position: 'absolute', bottom: 40, left: 20 }}>
// 			<ReactNativeJoystick
// 				radius={60}
// 				color="gray"
// 				onMove={handleMove}
// 				onStop={() =>
// 					setEntities((prev) => ({
// 						...prev,
// 						player: {
// 							...prev.player,
// 							velocity: { x: 0, y: 0 },
// 						},
// 					}))
// 				}
// 			/>
// 		</View>
// 	)
// }
