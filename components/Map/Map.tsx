import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import MapView, { LatLng, PROVIDER_GOOGLE } from 'react-native-maps'
import { useTheme } from 'react-native-paper'

import { GeoPosition } from '@/lib/geolocation'
import { useMapFilterStore } from '@/store/useMapFilter'
import { BathingWater } from '@/types/BathingWater/BathingWaters'

import BathingWaterMarker from './BathingWaterMarker'
import UserLocationMarker from './UserLocationMarker'

type MapProps = {
  watersAndAdvisories: { bathingWater: BathingWater }[]
  myLocation: GeoPosition | null
  onRequestMyLocation: () => void
  loadingLocation: boolean
}

export default function Map({
  watersAndAdvisories,
  myLocation,
  onRequestMyLocation,
  loadingLocation,
}: MapProps) {
  const theme = useTheme()
  const mapRef = useRef<MapView>(null)
  const municipality = useMapFilterStore((state) => state.municipality)
  const [showMarkers, setShowMarkers] = useState(false)

  const visibleWaters = useMemo(() => {
    return municipality
      ? watersAndAdvisories.filter(
          (item) => item.bathingWater.municipality.name === municipality
        )
      : watersAndAdvisories
  }, [watersAndAdvisories, municipality])

  useEffect(() => {
    if (!mapRef.current || visibleWaters.length === 0) return

    const coordinates: LatLng[] = visibleWaters.map(({ bathingWater }) => ({
      latitude: parseFloat(bathingWater.samplingPointPosition.latitude),
      longitude: parseFloat(bathingWater.samplingPointPosition.longitude),
    }))

    setShowMarkers(false)

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    })

    const timeout = setTimeout(() => {
      setShowMarkers(true)
    }, 500)

    return () => clearTimeout(timeout)
  }, [visibleWaters])

  useEffect(() => {
    if (!mapRef.current || !myLocation) return

    mapRef.current.animateToRegion(
      {
        ...myLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    )
  }, [myLocation])

  const onMarkerSelected = (marker: BathingWater) => {
    console.log(`Selected ${marker.name}`)
  }

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false}
        provider={PROVIDER_GOOGLE}
      >
        {showMarkers &&
          visibleWaters.map(({ bathingWater }) => (
            <BathingWaterMarker
              key={bathingWater.id}
              water={bathingWater}
              onPress={onMarkerSelected}
            />
          ))}

        {myLocation && showMarkers && (
          <UserLocationMarker location={myLocation} />
        )}
      </MapView>

      <TouchableOpacity
        style={{
          ...styles.myLocationButton,
          backgroundColor: theme.colors.background,
        }}
        onPress={onRequestMyLocation}
        disabled={loadingLocation}
      >
        <MaterialIcons
          name="my-location"
          size={24}
          style={{ color: theme.colors.primary }}
        />
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
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
