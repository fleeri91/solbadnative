import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import { ActivityIndicator, Text } from 'react-native-paper'

import { Map } from '@/components/Map'
import MapFilter from '@/components/MapFilter'

import { GeoPosition, useGeolocation } from '@/lib/geolocation'
import { useBathingWaters } from '@/lib/queries'

export default function Index() {
  const { data, isLoading, isError } = useBathingWaters()
  const { getCurrentLocation, loading: locating } = useGeolocation()
  const [myLocation, setMyLocation] = useState<GeoPosition | null>(null)
  const mapRef = useRef<MapView>(null)

  const handleMyLocation = async () => {
    const coords = await getCurrentLocation()
    if (!coords) return

    setMyLocation(coords)

    const region: Region = {
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }

    mapRef.current?.animateToRegion(region, 1000)
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
        watersAndAdvisories={data.watersAndAdvisories}
        myLocation={myLocation}
        onRequestMyLocation={handleMyLocation}
        loadingLocation={locating}
      />
      <MapFilter />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
})
