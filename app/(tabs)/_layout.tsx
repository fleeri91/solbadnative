import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

export default function TabsLayout() {
  let colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#0084d1' : '#00a6f4',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: isDark ? '#171717' : '#dff2fe',
        },
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Karta',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Sök',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
