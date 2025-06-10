import { municipalities, MunicipalityName } from '@/constants/municipalities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware'

export type MapFilterState = {
  municipality: MunicipalityName | null
}

type MapFilterActions = {
  setMunicipality: (value: MunicipalityName | null) => void
  reset: () => void
}

type MapFilterStore = MapFilterState & MapFilterActions

const initialState: MapFilterState = {
  municipality: null,
}

export const useMapFilterStore = create<MapFilterStore>()(
  persist(
    (set) => ({
      ...initialState,
      setMunicipality: (value) => set({ municipality: value }),
      reset: () => set(initialState),
    }),
    {
      name: 'mapfilter-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: MapFilterStore): MapFilterState => ({
        municipality: state.municipality,
      }),
      onRehydrateStorage: () => (state, error: Error | undefined) => {
        if (error) {
          console.error('Error rehydrating map filter store:', {
            error: error.message,
            stack: error.stack,
            state,
          })
        }
      },
    } as PersistOptions<MapFilterStore, MapFilterState>
  )
)

function isValidMunicipality(value: MunicipalityName | null) {
  return (
    value === null ||
    (typeof value === 'string' &&
      municipalities.includes(value as MunicipalityName))
  )
}

export const clearMapFilterStorage = async () => {
  try {
    await AsyncStorage.removeItem('mapfilter-storage')
    console.log('Cleared mapfilter-storage')
    useMapFilterStore.getState().reset()
  } catch (error) {
    console.error('Error clearing mapfilter-storage:', error)
  }
}
