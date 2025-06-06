// screens/index.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { InteractionManager, StyleSheet, View } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { ActivityIndicator, IconButton, Text } from 'react-native-paper'

import { Map } from '@/components/Map'
import MapFilter from '@/components/MapFilter'

import { useMapFilterStore } from '@/store/useMapFilter'

import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'
import { GeoPosition, useGeolocation } from '@/lib/geolocation'
import { useBathingWaters } from '@/lib/queries'

const DEFAULT_PADDING = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
}

export default function Index() {
  const { data, isLoading, isError } = useBathingWaters()
  const { getCurrentLocation, loading: locating } = useGeolocation()
  const [myLocation, setMyLocation] = useState<GeoPosition | null>(null)
  const mapRef = useRef<MapView>(null)

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredWaters = useFilteredBathingWaters(allWaters, myLocation)

  const { municipality } = useMapFilterStore()

  const handleMyLocation = async () => {
    const coords = await getCurrentLocation()
    if (!coords) return

    setMyLocation(coords)

    const region: Region = {
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }

    // Wait for interactions before animating
    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        resolve()
      })
    })
    mapRef.current?.animateToRegion(region, 300)
  }

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

  const fitMapToFilteredWaters = useCallback(() => {
    if (!mapRef.current || filteredWaters.length === 0) return

    const coordinates = filteredWaters.map((bw) => ({
      latitude: parseFloat(bw.samplingPointPosition.latitude),
      longitude: parseFloat(bw.samplingPointPosition.longitude),
    }))

    if (coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
      })

      // Nudge camera to fix gray screen on some devices
      setTimeout(() => {
        mapRef.current?.getCamera().then((camera) => {
          mapRef.current?.animateCamera(
            {
              center: {
                latitude: camera.center.latitude + 0.0001,
                longitude: camera.center.longitude + 0.0001,
              },
              pitch: camera.pitch,
              heading: camera.heading,
              altitude: camera.altitude,
              zoom: camera.zoom,
            },
            { duration: 100 }
          )
        })
      }, 500)
    }
  }, [filteredWaters])

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

  return (
    <View style={styles.container}>
      <Map
        bathingWaters={filteredWaters}
        mapRef={mapRef}
        myLocation={myLocation}
      />
      <MapFilter />
      <View style={styles.buttonContainer}>
        <IconButton
          icon={() => (
            <MaterialIcons name="my-location" size={24} color="white" />
          )}
          mode="contained"
          onPress={handleMyLocation}
          loading={locating}
          disabled={locating}
          style={styles.myLocationButton}
        />
      </View>
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
