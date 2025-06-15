import { BathingWater } from '@/types/BathingWater/BathingWaters'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import Carousel from 'react-native-reanimated-carousel'
import { DetailCardItem } from './DetailCardItem' // adjust path

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH
const CARD_HEIGHT = 125

interface DetailCardProps {
  bathingWaters: BathingWater[]
}

export default function DetailCardCarousel({ bathingWaters }: DetailCardProps) {
  const handleOnPress = (item: BathingWater) => {
    console.log(item.id)
    SheetManager.show('bathing-profile-sheet', {
      payload: { id: item.id },
    })
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        snapEnabled
        pagingEnabled
        autoPlayInterval={2000}
        data={bathingWaters}
        style={{ width: '100%' }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onSnapToItem={(index) => console.log('current index:', index)}
        renderItem={({ item, index }) => (
          <DetailCardItem
            bathingWater={item}
            index={index}
            rounded
            onPress={(selected) => {
              handleOnPress(selected)
            }}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: CARD_HEIGHT,
  },
})
