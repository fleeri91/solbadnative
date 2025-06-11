import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import { useTheme } from 'react-native-paper'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'

import { OnboardingSlide, StepIndicator } from '@/components/Onboarding'

import { MunicipalityName } from '@/constants/municipalities'

import { useGeolocationStore } from '@/store/useGeolocation'
import { useMapFilterStore } from '@/store/useMapFilter'
import { useOnboardingStore } from '@/store/useOnboarding'

const { width } = Dimensions.get('window')

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0)
  const scrollRef = useRef<Animated.ScrollView>(null)

  const animation = useRef<LottieView>(null)

  const theme = useTheme()

  const { getCurrentLocation } = useGeolocationStore()
  const setIsOnboarded = useOnboardingStore((s) => s.setIsOnboarded)
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

  const handleNavigateSlide = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    })
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
          button={{ onClick: () => handleNavigateSlide(1), title: 'Kom igång' }}
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

  const dotStyles = slides.map((_, i) =>
    StepIndicator(scrollX, i, theme.colors.primary, width)
  )
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
