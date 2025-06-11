import { Redirect } from 'expo-router'
import { useEffect, useRef } from 'react'
import { InteractionManager, StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'
import { ActivityIndicator, Text } from 'react-native-paper'

import { Map } from '@/components/Map'
import MapFilter from '@/components/MapFilter'

import { useMapFilterStore } from '@/store/useMapFilter'
import { useOnboardingStore } from '@/store/useOnboarding'

import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'

import { useBathingWaters } from '@/lib/queries'
import { useGeolocationStore } from '@/store/useGeolocation'

const DEFAULT_PADDING = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
}

export default function Index() {
  const mapRef = useRef<MapView>(null)

  const { isOnboarded, resetOnboarding } = useOnboardingStore()
  const { data, isLoading, isError } = useBathingWaters()
  const { geolocation } = useGeolocationStore()

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredWaters = useFilteredBathingWaters(allWaters)

  const { municipality } = useMapFilterStore()

  useEffect(() => {
    if (!mapRef.current || filteredWaters.length === 0) return

    const fitMap = async () => {
      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          resolve()
        })
      })

      const coordinates = filteredWaters.map((bw) => ({
        latitude: parseFloat(bw.samplingPointPosition.latitude),
        longitude: parseFloat(bw.samplingPointPosition.longitude),
      }))

      if (coordinates.length > 0) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        })
      }
    }

    fitMap()
  }, [municipality])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    )
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <Text>Ett fel uppstod</Text>
      </View>
    )
  }

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />
  }

  return (
    <View style={styles.container}>
      <Map
        bathingWaters={filteredWaters}
        mapRef={mapRef}
        myLocation={geolocation}
      />
      <MapFilter />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  myLocationButton: {
    borderRadius: 8,
  },
})
