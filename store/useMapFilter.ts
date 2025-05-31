import { create } from 'zustand'

import { MunicipalityName } from '@/constants/municipalities'
import { BathingWater } from '@/types/BathingWater/BathingWaters'

type MapFilterState = {
  municipality: MunicipalityName | null
  selectedLocation: BathingWater | null
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName | null) => void
  setSelectedLocation: (value: BathingWater | null) => void
}

const initialState: MapFilterState = {
  municipality: 'Karlskrona',
  selectedLocation: null,
}

export const useMapFilterStore = create<MapFilterState & MapFilterActions>(
  (set) => ({
    ...initialState,
    setMunicipality: (value) => set({ municipality: value }),
    setSelectedLocation: (value) => set({ selectedLocation: value }),
  })
)
