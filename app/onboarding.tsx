import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import { useTheme } from 'react-native-paper'
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import OnboardingSlide from '@/components/OnboardingSlide'

import { MunicipalityName } from '@/constants/municipalities'

import { useGeolocation } from '@/lib/geolocation'

import { useMapFilterStore } from '@/store/useMapFilter'
import { useUserStore } from '@/store/useUser'

const { width } = Dimensions.get('window')

function useDotAnimatedStyle(
  scrollX: SharedValue<number>,
  index: number,
  color: string
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

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0)
  const scrollRef = useRef<Animated.ScrollView>(null)

  const animation = useRef<LottieView>(null)

  const theme = useTheme()

  const { getCurrentLocation } = useGeolocation()
  const setIsOnboarded = useUserStore((s) => s.setIsOnboarded)
  const setMunicipality = useMapFilterStore((s) => s.setMunicipality)

  const [selected, setSelected] = useState<MunicipalityName | ''>('')
  const [loading, setLoading] = useState(false)

  const handleGeolocation = async () => {
    setLoading(true)
    const coords = await getCurrentLocation()
    if (coords) {
      setIsOnboarded(true)
      router.replace('/')
    }
    setLoading(false)
  }

  const handleSetMunicipality = async () => {
    if (selected) {
      setMunicipality(selected)
      setIsOnboarded(true)
      router.replace('/')
    }
  }

  const slides = [
    {
      key: 'intro',
      content: (
        <OnboardingSlide
          title="Välkommen"
          subtitle="Hitta badplats"
          lottie={
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: '100%',
                height: 200,
              }}
              source={require('@/assets/lottie/sunny.json')}
            />
          }
          description="Appen som hjälper dig att utforska badplater."
          button={{ onClick: () => null, title: 'Kom igång' }}
        />
      ),
    },
    {
      key: 'geo',
      content: (
        <OnboardingSlide
          title="Plats"
          subtitle="Steg 1"
          lottie={
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: '100%',
                height: 200,
              }}
              source={require('@/assets/lottie/sunny.json')}
            />
          }
          description="Appen använder platsbehörighet för att kunna hitta badplatser nära dig. Du kan ändra inställnigar i appen när du vill."
          button={{ onClick: () => null, title: 'Acceptera' }}
        />
      ),
    },
    {
      key: 'municipality-info',
      content: (
        <OnboardingSlide
          title="Välj kommun"
          subtitle="Steg 2"
          lottie={
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: '100%',
                height: 200,
              }}
              source={require('@/assets/lottie/sunny.json')}
            />
          }
          description="Appen hittar badplatser utifrån vald kommun. Vi vill därför att du väljer den kommun du vill utforska badplatser på."
          button={{
            onClick: () => SheetManager.show('map-filter-sheet'),
            title: 'Välj kommun',
          }}
        />
      ),
    },
    {
      key: 'finish',
      content: (
        <OnboardingSlide
          title="Slutför"
          subtitle="Hitta badplats"
          lottie={
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: '100%',
                height: 200,
              }}
              source={require('@/assets/lottie/sunny.json')}
            />
          }
          description=""
          button={{ onClick: () => null, title: 'Utforska' }}
        />
      ),
    },
  ]

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const dot0Style = useDotAnimatedStyle(scrollX, 0, theme.colors.primary)
  const dot1Style = useDotAnimatedStyle(scrollX, 1, theme.colors.primary)
  const dot2Style = useDotAnimatedStyle(scrollX, 2, theme.colors.primary)
  const dot3Style = useDotAnimatedStyle(scrollX, 3, theme.colors.primary)

  const dotStyles = [dot0Style, dot1Style, dot2Style, dot3Style]

  return (
    <View
      style={{ ...styles.fullscreen, backgroundColor: theme.colors.background }}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View style={{ width }} key={slide.key}>
            {slide.content}
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {dotStyles.map((style, i) => (
          <Animated.View key={i} style={[styles.dot, style]} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  centered: {
    textAlign: 'center',
    marginTop: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
    marginTop: 16,
  },
  dot: {
    backgroundColor: '#ccc',
  },
})
