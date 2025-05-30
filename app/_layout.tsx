import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { SheetProvider } from 'react-native-actions-sheet'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import '@/lib/sheet'

import { AuthProvider, useAuth } from '@/lib/auth-context'

const queryClient = new QueryClient()

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoadingUser } = useAuth()
  const segments = useSegments()

  const [isRouterReady, setIsRouterReady] = useState(false)

  useEffect(() => {
    setIsRouterReady(true)
  }, [])

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth'

    if (isRouterReady) {
      if (!user && !inAuthGroup && !isLoadingUser) {
        router.replace('/auth')
      } else if (user && inAuthGroup && !isLoadingUser) {
        router.replace('/')
      }
    }
  }, [user, segments, isRouterReady])

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SheetProvider>
          <PaperProvider>
            <SafeAreaProvider>
              <RouteGuard>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </RouteGuard>
            </SafeAreaProvider>
          </PaperProvider>
        </SheetProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
