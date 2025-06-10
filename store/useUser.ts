import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  isOnboarded: boolean
}

interface UserActions {
  setIsOnboarded: (value: boolean) => void
  resetOnboarding: () => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isOnboarded: false,
      setIsOnboarded: (value: boolean) => set({ isOnboarded: value }),
      resetOnboarding: () => set({ isOnboarded: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isOnboarded: state.isOnboarded }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating user store:', error)
        }
      },
    }
  )
)
