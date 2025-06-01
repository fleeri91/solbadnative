import { create } from 'zustand'

import { MunicipalityName } from '@/constants/municipalities'

type MapFilterState = {
  municipality: MunicipalityName | null
  maxDistance: number | null
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName | null) => void
  setMaxDistance: (value: number | null) => void
}

const initialState: MapFilterState = {
  municipality: null,
  maxDistance: null,
}

export const useMapFilterStore = create<MapFilterState & MapFilterActions>(
  (set) => ({
    ...initialState,
    setMunicipality: (value) => set({ municipality: value }),
    setMaxDistance: (value) => set({ maxDistance: value }),
  })
)
