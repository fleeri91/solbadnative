import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'

import { AuthProvider, useAuth } from '@/lib/auth-context'

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
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  )
}
