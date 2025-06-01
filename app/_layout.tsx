import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
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
  let colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SheetProvider>
          <PaperProvider>
            <SafeAreaProvider>
              <RouteGuard>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
                    },
                    headerShadowVisible: false,
                    headerTitleStyle: {
                      color: isDark ? '#fafafa' : '#0a0a0a',
                      fontWeight: '600',
                    },
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  {/*}
                  <Stack.Screen
                    name="info/[id]"
                    options={{
                      title: '',
                      headerBackButtonMenuEnabled: true,
                      headerBackButtonDisplayMode: 'minimal',
                    }}
                  />
                  */}
                </Stack>
              </RouteGuard>
            </SafeAreaProvider>
          </PaperProvider>
        </SheetProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
