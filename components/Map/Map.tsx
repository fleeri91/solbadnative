import { BathingWater } from '@/types/BathingWater/BathingWaters'
import { LocationObject } from 'expo-location'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import BathingWaterMarker from './BathingWaterMarker'

interface MapProps {
  bathingWaters: BathingWater[]
  mapRef: React.RefObject<MapView | null>
  myLocation: LocationObject | null
}

export default function Map({ bathingWaters, mapRef, myLocation }: MapProps) {
  const [zoomLevel, setZoomLevel] = useState(12)

  const handleRegionChangeComplete = (region: Region) => {
    const zoom = Math.round(Math.log2(360 / region.latitudeDelta))
    setZoomLevel(zoom)
  }

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={!!myLocation}
      onRegionChangeComplete={handleRegionChangeComplete}
    >
      {bathingWaters.map((water) => (
        <BathingWaterMarker
          key={water.id}
          water={water}
          zoomLevel={zoomLevel}
        />
      ))}
    </MapView>
  )
}
