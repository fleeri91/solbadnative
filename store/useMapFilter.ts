import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { MunicipalityName } from '@/constants/municipalities'

type MapFilterState = {
  municipality: MunicipalityName | null
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName) => void
}

const initialState: MapFilterState = {
  municipality: null,
}

export const useMapFilterStore = create<MapFilterState & MapFilterActions>()(
  persist(
    (set) => ({
      ...initialState,
      setMunicipality: (value) => set({ municipality: value }),
    }),
    {
      name: 'map-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
