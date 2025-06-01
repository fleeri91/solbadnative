// components/BathingWaterMarker.tsx
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Marker } from 'react-native-maps'

type Props = {
  water: BathingWater
  onPress: (water: BathingWater) => void
}

export default function BathingWaterMarker({ water, onPress }: Props) {
  const latitude = parseFloat(water.samplingPointPosition.latitude)
  const longitude = parseFloat(water.samplingPointPosition.longitude)

  if (isNaN(latitude) || isNaN(longitude)) return null

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      title={water.name}
      description={water.description || ''}
      onPress={() => onPress(water)}
    >
      <MaterialIcons name="location-pin" size={36} color="tomato" />
    </Marker>
  )
}
