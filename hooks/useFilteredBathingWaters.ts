import { GeoPosition } from '@/lib/geolocation'
import { getDistanceInKm, isInsideSweden } from '@/lib/helpers'
import { useMapFilterStore } from '@/store/useMapFilter'
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import { WaterTypeId } from '@/types/BathingWater/WaterType'
import { useMemo } from 'react'

export const useFilteredBathingWaters = (
  bathingWaters: BathingWater[],
  myLocation: GeoPosition | null
): BathingWater[] => {
  const { filterMode, municipality, maxDistance } = useMapFilterStore()

  return useMemo(() => {
    const baseFiltered = bathingWaters.filter((bw) => {
      const lat = parseFloat(bw.samplingPointPosition.latitude)
      const lon = parseFloat(bw.samplingPointPosition.longitude)
      const isWaterTypeValid =
        bw.waterTypeId === WaterTypeId.HAV || bw.waterTypeId === WaterTypeId.SJÖ
      return isInsideSweden(lat, lon) && isWaterTypeValid
    })

    if (filterMode === 'municipality' && municipality) {
      return baseFiltered.filter(
        (bw) =>
          bw.municipality?.name?.toLowerCase() === municipality.toLowerCase()
      )
    }

    if (
      filterMode === 'nearby' &&
      myLocation &&
      maxDistance !== null &&
      maxDistance !== undefined
    ) {
      return baseFiltered.filter((bw) => {
        const lat = parseFloat(bw.samplingPointPosition.latitude)
        const lon = parseFloat(bw.samplingPointPosition.longitude)
        const dist = getDistanceInKm(
          myLocation.latitude,
          myLocation.longitude,
          lat,
          lon
        )
        return dist <= maxDistance
      })
    }
    return baseFiltered
  }, [bathingWaters, filterMode, municipality, maxDistance, myLocation])
}
