import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SheetManager } from 'react-native-actions-sheet'
import { Appbar } from 'react-native-paper'

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
          headerTitle: 'Hitta Badplats',
          headerLeft: () => (
            <>
              <Appbar.Action icon="menu" onPress={() => {}} />
            </>
          ),
          headerRight: () => (
            <>
              <Appbar.Action
                icon="filter"
                onPress={() => SheetManager.show('map-filter-sheet')}
              />
            </>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Lista',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
