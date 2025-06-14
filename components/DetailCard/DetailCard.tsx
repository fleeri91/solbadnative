import { BathingWater } from '@/types/BathingWater/BathingWaters'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native'
import { Card } from 'react-native-paper'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.8
const SPACING = SCREEN_WIDTH * 0.1 // spacing on each side

interface DetailCardProps {
  bathingWaters: BathingWater[]
}

export default function DetailCard({ bathingWaters }: DetailCardProps) {
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState(0)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        scrollX.setValue(gestureState.dx)
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 100
        let nextIndex = currentIndex

        if (
          gestureState.dx < -threshold &&
          currentIndex < bathingWaters.length - 1
        ) {
          nextIndex = currentIndex + 1
        } else if (gestureState.dx > threshold && currentIndex > 0) {
          nextIndex = currentIndex - 1
        }

        setCurrentIndex(nextIndex)

        // Animate scrollX back to 0
        Animated.spring(scrollX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      },
    })
  ).current

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: Animated.add(
                scrollX,
                new Animated.Value(-currentIndex * (CARD_WIDTH + SPACING))
              ),
            },
          ],
        }}
      >
        {bathingWaters.map((item, index) => (
          <View
            key={`${item.id}-${index}`}
            {...(index === currentIndex ? panResponder.panHandlers : {})}
            style={styles.cardWrapper}
          >
            <Card style={styles.card} elevation={5}>
              <Image
                source={{
                  uri: 'https://picsum.photos/seed/' + item.id + '/3000/2000',
                }}
                style={styles.image}
                resizeMode="cover"
              />
              <Card.Title title={item.name} />
            </Card>
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: SCREEN_WIDTH,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
  },
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 120,
  },
})
