import { useAuth } from '@/lib/auth-context'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'

export default function Index() {
  const { signOut, user } = useAuth()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Map View
        </Text>
        <Button mode="text" onPress={signOut} icon={'logout'}>
          Logga ut
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
  },
})
