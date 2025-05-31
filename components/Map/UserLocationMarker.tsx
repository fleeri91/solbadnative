// components/UserLocationMarker.tsx
import { GeoPosition } from '@/lib/geolocation'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Marker } from 'react-native-maps'
import DropMarker from './DropMarker'

type Props = {
  location: GeoPosition
}

export default function UserLocationMarker({ location }: Props) {
  return (
    <Marker coordinate={location} title="Min position">
      <DropMarker>
        <MaterialIcons name="circle" size={32} color="dodgerblue" />
      </DropMarker>
    </Marker>
  )
}
