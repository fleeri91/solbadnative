// components/BathingWaterMarker.tsx
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import { WaterTypeId } from '@/types/BathingWater/WaterType'
import { StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'

type Props = {
  water: BathingWater
  zoomLevel: number
  setSelectedWater: (bathingWater: BathingWater) => void
}

export default function BathingWaterMarker({
  water,
  zoomLevel,
  setSelectedWater,
}: Props) {
  const latitude = parseFloat(water.samplingPointPosition.latitude)
  const longitude = parseFloat(water.samplingPointPosition.longitude)

  if (isNaN(latitude) || isNaN(longitude)) return null

  const size = Math.max(16, Math.min(40, zoomLevel * 2))

  const getColorByWaterType = (waterType: WaterTypeId) => {
    switch (waterType) {
      case 1: // Sea
        return '#007AFF'
      case 3: // Lake
        return '#4ABDAC'
      default:
        return '#FF3B30'
    }
  }

  const onSelect = (water: BathingWater) => {
    setSelectedWater(water)
  }

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onSelect={() => onSelect(water)}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.markerOuter,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <View
            style={[
              styles.markerInner,
              {
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: (size * 0.6) / 2,
                backgroundColor: getColorByWaterType(water.waterTypeId),
              },
            ]}
          />
        </View>
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  markerOuter: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  markerInner: {
    backgroundColor: 'tomato', // dynamic in render
  },
})
