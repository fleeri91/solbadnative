import { BathingWater } from '@/types/BathingWater/BathingWaters'
import React from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

interface MapProps {
  bathingWaters: BathingWater[]
  mapRef: React.RefObject<MapView | null>
  myLocation: { latitude: number; longitude: number } | null
}

export default function Map({ bathingWaters, mapRef, myLocation }: MapProps) {
  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={!!myLocation}
    >
      {bathingWaters.map((water) => (
        <Marker
          key={water.id}
          coordinate={{
            latitude: parseFloat(water.samplingPointPosition.latitude),
            longitude: parseFloat(water.samplingPointPosition.longitude),
          }}
        />
      ))}
    </MapView>
  )
}
