import { BathingWater } from '@/types/BathingWater/BathingWaters'
import React from 'react'
import {
  Dimensions,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewProps,
} from 'react-native'
import { Pressable } from 'react-native-gesture-handler'
import { Card, Text, useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH
const CARD_HEIGHT = 100

interface DetailCardItemProps extends AnimatedProps<ViewProps> {
  style?: StyleProp<ImageStyle>
  index: number
  rounded?: boolean
  bathingWater: BathingWater
  onPress?: (item: BathingWater) => void
}

export const DetailCardItem: React.FC<DetailCardItemProps> = ({
  style,
  index,
  rounded = false,
  bathingWater,
  onPress,
  testID,
  ...animatedViewProps
}) => {
  const { colors } = useTheme()

  const handlePress = () => {
    if (onPress) {
      onPress(bathingWater)
    }
  }

  return (
    <Pressable style={{ flex: 1 }} onPress={handlePress}>
      <Animated.View
        testID={testID}
        style={[
          styles.cardWrapper,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundColor: colors.surface,
          },
        ]}
        {...animatedViewProps}
      >
        <Card style={styles.infoContainer}>
          <Text variant="titleLarge">{bathingWater.name}</Text>
          <Text variant="titleMedium">{bathingWater.waterTypeIdText}</Text>
        </Card>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 15,
  },
  infoContainer: {
    padding: 10,
    height: '100%',
  },
})
