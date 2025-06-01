import { useBathingWaterProfile } from '@/lib/queries'
import { BathingWaterProfile } from '@/types/BathingWater/BathingWaterProfile'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRef } from 'react'
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native'
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from 'react-native-actions-sheet'
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

export default function BathingProfile() {
  const payload = useSheetPayload('bathing-profile-sheet')

  const { data, isLoading, isError } = useBathingWaterProfile(payload.id)

  const theme = useTheme()

  const actionSheetRef = useRef<ActionSheetRef>(null)

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
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled={true}
      indicatorStyle={{ width: 100 }}
      closable
      disableDragBeyondMinimumSnapPoint
      containerStyle={{ height: '90%' }}
      springOffset={300}
    >
      <View style={styles.topBar}>
        <View style={styles.topBarInfo}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onBackground }}
          >
            {bathingWater.name}
          </Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onBackground, marginBottom: 12 }}
          >
            {`${bathingWater.municipality.name} kommun`}
          </Text>
        </View>
        <View style={styles.topBarClose}>
          <IconButton
            icon={() => <MaterialIcons name="close" size={24} color="black" />}
            onPress={() => SheetManager.hide('bathing-profile-sheet')}
          />
        </View>
      </View>
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          variant="titleSmall"
          style={{ color: theme.colors.onBackground, marginBottom: 16 }}
        >
          {bathingWater.description}
        </Text>

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
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
    elevation: 4,
  },
  topBarInfo: {
    alignItems: 'center',
  },
  topBarClose: {
    position: 'absolute',
    right: 0,
  },
  container: {
    width: '100%',
    justifyContent: 'flex-start',
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
