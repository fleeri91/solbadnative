import { useFilteredBathingWaters } from '@/hooks/useFilteredBathingWaters'
import { useMapFilterStore } from '@/store/useMapFilter'
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import { useEffect } from 'react'
import MapView from 'react-native-maps'

const DEFAULT_PADDING = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
}

export const useFitMapToMarkers = (
  mapRef: React.RefObject<MapView | null>,
  waters: BathingWater[]
) => {
  const filteredWaters = useFilteredBathingWaters(waters)
  const { municipality } = useMapFilterStore()

  useEffect(() => {
    if (!mapRef.current || filteredWaters.length === 0) return

    const coordinates = filteredWaters.map((bw) => ({
      latitude: parseFloat(bw.samplingPointPosition.latitude),
      longitude: parseFloat(bw.samplingPointPosition.longitude),
    }))

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: DEFAULT_PADDING,
    })
  }, [municipality, filteredWaters, mapRef])
}
