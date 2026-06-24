import { View } from "react-native"

export const Debris = ({ body, size }) => {
	const [w, h] = size

	return (
		<View
			style={{
				position: 'absolute',
				left: body.position.x - w / 2,
				top: body.position.y - h / 2,
				width: w,
				height: h,
				backgroundColor: '#A0522D',
			}}
		/>
	)
}
