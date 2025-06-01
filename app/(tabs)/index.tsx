// screens/index.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { ActivityIndicator, IconButton, Text } from 'react-native-paper'

import { Map } from '@/components/Map'
import MapFilter from '@/components/MapFilter'

import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'
import { GeoPosition, useGeolocation } from '@/lib/geolocation'
import { useBathingWaters } from '@/lib/queries'

export default function Index() {
  const { data, isLoading, isError } = useBathingWaters()
  const { getCurrentLocation, loading: locating } = useGeolocation()
  const [myLocation, setMyLocation] = useState<GeoPosition | null>(null)
  const mapRef = useRef<MapView>(null)

  const allWaters = data?.watersAndAdvisories.map((w) => w.bathingWater) || []
  const filteredWaters = useFilteredBathingWaters(allWaters)

  const handleMyLocation = async () => {
    const coords = await getCurrentLocation()
    if (!coords) return

    setMyLocation(coords)

    const region: Region = {
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }
    mapRef.current?.animateToRegion(region, 300)
  }

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
