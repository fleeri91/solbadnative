import { Tabs } from 'expo-router'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'dodgerblue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Karta',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked-alt" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Sök',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="search" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
