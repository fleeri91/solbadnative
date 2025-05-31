// components/DropMarker.tsx
import React, { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  children: React.ReactNode
}

export default function DropMarker({ children }: Props) {
  const translateY = useSharedValue(60)

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bounce,
    })
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
