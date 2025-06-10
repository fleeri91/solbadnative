import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

export default function StepIndicator(
  scrollX: SharedValue<number>,
  index: number,
  color: string,
  width: number
) {
  return useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [6, 12, 6],
      Extrapolation.CLAMP
    )
    return {
      width: dotWidth,
      height: 6,
      borderRadius: 3,
      marginHorizontal: 4,
      backgroundColor: color,
    }
  })
}
