import { useBathingWaterProfile } from '@/lib/queries'
import { BathingWaterProfile } from '@/types/BathingWater/BathingWaterProfile'
import * as Linking from 'expo-linking'
import { useLocalSearchParams } from 'expo-router'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Divider,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

export default function DetailsScreen() {
  const { id } = useLocalSearchParams()
  const stringId = Array.isArray(id) ? id[0] : id

  const { data, isLoading, isError } = useBathingWaterProfile(stringId)
  const theme = useTheme()

  if (isLoading) {
    return (
      <Surface
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator
          size="large"
          animating
          color={theme.colors.primary}
        />
      </Surface>
    )
  }

  if (isError || !data) {
    return (
      <Surface
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <Text>Ett fel uppstod</Text>
      </Surface>
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={{ color: theme.colors.onBackground }}>
        {bathingWater.name}
      </Text>
      <Text style={{ color: theme.colors.onBackground, marginBottom: 12 }}>
        Kommun: {bathingWater.municipality.name}
      </Text>
      <Text style={{ color: theme.colors.onBackground, marginBottom: 16 }}>
        {bathingWater.description}
      </Text>

      <Divider style={styles.divider} />

      <Text
        variant="titleMedium"
        style={{ color: theme.colors.onBackground, marginBottom: 8 }}
      >
        Badperiod
      </Text>
      <Text style={{ color: theme.colors.onBackground }}>
        {new Date(bathingSeason.startsAt).toLocaleDateString()} -{' '}
        {new Date(bathingSeason.endsAt).toLocaleDateString()}
      </Text>

      <Divider style={styles.divider} />

      <Text
        variant="titleMedium"
        style={{ color: theme.colors.onBackground, marginBottom: 8 }}
      >
        Kvalitetsklassificering (senaste 4 åren)
      </Text>
      {lastFourClassifications.map((c) => (
        <Text key={c.year} style={{ color: theme.colors.onBackground }}>
          {c.year}: {c.qualityClassIdText}
        </Text>
      ))}

      <Divider style={styles.divider} />

      <Text
        variant="titleMedium"
        style={{ color: theme.colors.onBackground, marginBottom: 8 }}
      >
        Kontaktinformation
      </Text>
      <Text style={{ color: theme.colors.onBackground }}>
        Kommun: {bathingWater.municipality.contactInfo.name}
      </Text>
      {bathingWater.municipality.contactInfo.email && (
        <Text style={{ color: theme.colors.onBackground }}>
          E-post: {bathingWater.municipality.contactInfo.email}
        </Text>
      )}
      {bathingWater.municipality.contactInfo.phone && (
        <Text style={{ color: theme.colors.onBackground }}>
          Telefon: {bathingWater.municipality.contactInfo.phone}
        </Text>
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
  divider: {
    marginVertical: 12,
  },
})
