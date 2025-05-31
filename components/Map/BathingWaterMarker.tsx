// components/BathingWaterMarker.tsx
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Marker } from 'react-native-maps'
import DropMarker from './DropMarker'

type Props = {
  water: BathingWater
  onPress: (water: BathingWater) => void
}

export default function BathingWaterMarker({ water, onPress }: Props) {
  const latitude = parseFloat(water.samplingPointPosition.latitude)
  const longitude = parseFloat(water.samplingPointPosition.longitude)

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      title={water.name}
      description={water.description || ''}
      onPress={() => onPress(water)}
    >
      <DropMarker>
        <MaterialIcons name="location-pin" size={36} color="tomato" />
      </DropMarker>
    </Marker>
  )
}
