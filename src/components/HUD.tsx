import { View, Text } from 'react-native'

export const HUD = ({ score, coins, lives, world }: any) => {
	return (
		<View
			style={{
				position: 'absolute',
				top: 40,
				left: 20,
				right: 20,
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}
		>
			<View>
				<Text>MARIO</Text>
				<Text>{score}</Text>
			</View>

			<View>
				<Text>🪙 {coins}</Text>
			</View>

			<View>
				<Text>WORLD</Text>
				<Text>{world}</Text>
			</View>

			<View>
				<Text>LIVES</Text>
				<Text>x {lives}</Text>
			</View>
		</View>
	)
}
