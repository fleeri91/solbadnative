import { useBathingWaterProfile } from '@/lib/queries'
import { BathingWaterProfile } from '@/types/BathingWater/BathingWaterProfile'
import * as Linking from 'expo-linking'
import { useLocalSearchParams } from 'expo-router'
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator, Button, Divider } from 'react-native-paper'

export default function DetailsScreen() {
  const { id } = useLocalSearchParams()
  const stringId = Array.isArray(id) ? id[0] : id

  const { data, isLoading, isError } = useBathingWaterProfile(stringId)

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    )
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text>Ett fel uppstod</Text>
      </View>
    )
  }

  const profile = data as BathingWaterProfile
  const { bathingWater, lastFourClassifications, bathingSeason } = profile
  const { latitude, longitude } = bathingWater.samplingPointPosition

  const navigationUrl =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bathingWater.name}</Text>
      <Text style={styles.subtitle}>
        Kommun: {bathingWater.municipality.name}
      </Text>
      <Text style={styles.description}>{bathingWater.description}</Text>

      <Divider style={styles.divider} />
      <Text style={styles.sectionTitle}>Badperiod</Text>
      <Text>
        {new Date(bathingSeason.startsAt).toLocaleDateString()} -{' '}
        {new Date(bathingSeason.endsAt).toLocaleDateString()}
      </Text>

      <Divider style={styles.divider} />
      <Text style={styles.sectionTitle}>
        Kvalitetsklassificering (senaste 4 åren)
      </Text>
      {lastFourClassifications.map((c) => (
        <Text key={c.year}>
          {c.year}: {c.qualityClassIdText}
        </Text>
      ))}

      <Divider style={styles.divider} />
      <Text style={styles.sectionTitle}>Kontaktinformation</Text>
      <Text>Kommun: {bathingWater.municipality.contactInfo.name}</Text>
      {bathingWater.municipality.contactInfo.email && (
        <Text>E-post: {bathingWater.municipality.contactInfo.email}</Text>
      )}
      {bathingWater.municipality.contactInfo.phone && (
        <Text>Telefon: {bathingWater.municipality.contactInfo.phone}</Text>
      )}

      <Divider style={styles.divider} />
      <Button mode="contained" onPress={() => Linking.openURL(navigationUrl)}>
        Navigera till badplats
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
})
