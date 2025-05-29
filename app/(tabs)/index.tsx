import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import { ActivityIndicator, Text, useTheme } from 'react-native-paper'

import { GeoPosition, useGeolocation } from '@/lib/geolocation'
import { useBathingWaters } from '@/lib/queries'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRef, useState } from 'react'

export default function Index() {
  const { data, isLoading, isError } = useBathingWaters()
  const theme = useTheme()
  const { getCurrentLocation, loading: locating } = useGeolocation()
  const [myLocation, setMyLocation] = useState<GeoPosition | null>(null)

  const mapRef = useRef<MapView>(null)

  const handleMyLocation = async () => {
    const coords = await getCurrentLocation()

    if (!coords) {
      console.warn('No coordinates returned.')
      return
    }

    console.log('My location:', coords)
    console.log('MapRef:', mapRef.current)

    setMyLocation(coords)

    const region: Region = {
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }

    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000)
    } else {
      console.warn('Map ref not available.')
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Ett fel uppstod</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} showsUserLocation={false}>
        {data &&
          data.watersAndAdvisories.map(({ bathingWater }) => (
            <Marker
              key={bathingWater.id}
              coordinate={{
                latitude: parseFloat(
                  bathingWater.samplingPointPosition.latitude
                ),
                longitude: parseFloat(
                  bathingWater.samplingPointPosition.longitude
                ),
              }}
              title={bathingWater.name}
              description={bathingWater.description || ''}
            />
          ))}

        {myLocation && (
          <Marker
            coordinate={myLocation}
            title="Min position"
            pinColor="dodgerblue"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={{
          ...styles.myLocationButton,
          backgroundColor: theme.colors.background,
        }}
        onPress={handleMyLocation}
        disabled={locating}
      >
        <MaterialIcons
          name="my-location"
          size={24}
          style={{ color: theme.colors.primary }}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
})
