import { Redirect } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  View,
} from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { useTheme } from 'react-native-paper'

import BathingWaterMarker from '@/components/BathingWaterMarker'
import MapFilter from '@/components/MapFilter'

import BathingProfile from '@/components/BathingProfile'
import { DetailCardCarousel } from '@/components/DetailCard'
import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'
import { useBathingWaters } from '@/lib/queries'
import { useGeolocationStore } from '@/store/useGeolocation'
import { useMapFilterStore } from '@/store/useMapFilter'
import { useOnboardingStore } from '@/store/useOnboarding'

const DEFAULT_PADDING = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
}

export default function Index() {
  const mapRef = useRef<MapView>(null)
  const didFitMap = useRef(false)

  const [isMapReady, setIsMapReady] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(12)

  const { isOnboarded } = useOnboardingStore()
  const { data, isLoading } = useBathingWaters()
  const { geolocation } = useGeolocationStore()
  const { setBathingWater, municipality, selectedBathingWater } =
    useMapFilterStore()

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredWaters = useFilteredBathingWaters(allWaters)

  const { colors } = useTheme()

  const handleRegionChangeComplete = (region: Region) => {
    const zoom = Math.round(Math.log2(360 / region.latitudeDelta))
    setZoomLevel(zoom)
  }

  useEffect(() => {
    didFitMap.current = false
  }, [municipality])

  useEffect(() => {
    if (
      !mapRef.current ||
      !isMapReady ||
      filteredWaters.length === 0 ||
      didFitMap.current
    )
      return

    const fitMap = async () => {
      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => resolve())
      })

      const coordinates = filteredWaters.map((bw) => ({
        latitude: parseFloat(bw.samplingPointPosition.latitude),
        longitude: parseFloat(bw.samplingPointPosition.longitude),
      }))

      if (coordinates.length > 0 && mapRef.current) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        })
        didFitMap.current = true
      }
    }

    fitMap()
  }, [filteredWaters, isMapReady])

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />
  }

  if (isLoading || !data) {
    return (
      <View
        style={{
          ...styles.loadingContainer,
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.onBackground} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        onMapReady={() => setIsMapReady(true)}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={!!geolocation}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {isMapReady &&
          filteredWaters.map((water) => (
            <BathingWaterMarker
              key={water.id}
              water={water}
              zoomLevel={zoomLevel}
              setSelectedWater={setBathingWater}
            />
          ))}
      </MapView>
      <MapFilter />
      <BathingProfile />
      {filteredWaters.length > 0 && (
        <DetailCardCarousel bathingWaters={filteredWaters} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
