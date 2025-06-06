import { create } from 'zustand'

import { MunicipalityName } from '@/constants/municipalities'

export type FilterMode = 'municipality' | 'nearby' | null

export type MapFilterState = {
  municipality: MunicipalityName | null
  maxDistance: number | null
  filterMode: FilterMode
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName | null) => void
  setMaxDistance: (value: number | null) => void
  setFilterMode: (mode: FilterMode) => void
  setMapFilter: (filter: MapFilterState) => void
}

const initialState: MapFilterState = {
  municipality: null,
  maxDistance: null,
  filterMode: 'nearby',
}

export const useMapFilterStore = create<MapFilterState & MapFilterActions>(
  (set) => ({
    ...initialState,
    setMunicipality: (value) => set({ municipality: value }),
    setMaxDistance: (value) => set({ maxDistance: value }),
    setFilterMode: (mode) => set({ filterMode: mode }),
    setMapFilter: (filter) =>
      set({
        municipality: filter.municipality,
        maxDistance: filter.maxDistance,
        filterMode: filter.filterMode,
      }),
  })
)
