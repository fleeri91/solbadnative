import { Tabs } from 'expo-router'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'dodgerblue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Karta',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Sök',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
