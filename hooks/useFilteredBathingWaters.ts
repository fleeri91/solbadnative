import { useMapFilterStore } from '@/store/useMapFilter'
import { BathingWater } from '@/types/BathingWater/BathingWaters'
import { useMemo } from 'react'

function isInsideSweden(lat: number, lon: number): boolean {
  return lat >= 55.0 && lat <= 69.1 && lon >= 10.9 && lon <= 24.2
}

export const useFilteredBathingWaters = (
  bathingWaters: BathingWater[]
): BathingWater[] => {
  const { municipality } = useMapFilterStore()

  return useMemo(() => {
    const inSweden = bathingWaters.filter((bw) => {
      const lat = parseFloat(bw.samplingPointPosition.latitude)
      const lon = parseFloat(bw.samplingPointPosition.longitude)
      return isInsideSweden(lat, lon)
    })

    if (!municipality) return inSweden

    return inSweden.filter(
      (bw) =>
        bw.municipality?.name?.toLowerCase() === municipality.toLowerCase()
    )
  }, [bathingWaters, municipality])
}
