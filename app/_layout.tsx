import Entypo from '@expo/vector-icons/Entypo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Font from 'expo-font'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { darkTheme, lightTheme } from '@/constants/theme'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import '@/lib/sheet'

// 👇 Prevent splash screen from hiding too early
SplashScreen.preventAutoHideAsync().catch(() => {})

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
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font)
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  // Hide splash screen once layout is complete
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
          <SheetProvider>
            <SafeAreaProvider onLayout={onLayoutRootView}>
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
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </RouteGuard>
            </SafeAreaProvider>
          </SheetProvider>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
