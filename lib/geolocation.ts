import * as Location from 'expo-location'
import { useState } from 'react'

export type GeoPosition = {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = async (): Promise<GeoPosition | null> => {
    try {
      setLoading(true)

      // Ask for permissions
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn('Location permission not granted')
        setLoading(false)
        return null
      }

      // Get current position
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const position = { latitude, longitude }

      return position
    } catch (error) {
      console.error('Error getting location:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getCurrentLocation, loading }
}
