import { StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { ActivityIndicator, Text } from 'react-native-paper'

import { useBathingWaters } from '@/lib/queries'
import { useEffect } from 'react'

export default function Index() {
  const { data, isLoading, isError } = useBathingWaters()

  useEffect(() => {
    if (data) {
      const havItems = data.watersAndAdvisories.filter(
        (item) => item.bathingWater.waterTypeId === 1
      )
      const sjoItems = data.watersAndAdvisories.filter(
        (item) => item.bathingWater.waterTypeId === 3
      )
      console.log('Hav:', havItems.length)
      console.log('Sjö:', sjoItems.length)
    }
  }, [data])

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
      <MapView style={styles.map}>
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
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
})
