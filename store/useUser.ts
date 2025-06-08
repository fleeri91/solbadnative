import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type UserState = {
  isOnboarded: boolean
  setIsOnboarded: (value: boolean) => void
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isOnboarded: false,
      setIsOnboarded: (value: boolean) => set({ isOnboarded: value }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
