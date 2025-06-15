import { useBathingWaterProfile } from '@/lib/queries'
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
  Text,
  useTheme,
} from 'react-native-paper'

export default function BathingProfile() {
  const payload = useSheetPayload('bathing-profile-sheet')

  const { data, isLoading, isError } = useBathingWaterProfile(payload.id)

  const theme = useTheme()

  const actionSheetRef = useRef<ActionSheetRef>(null)

  return (
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled={true}
      indicatorStyle={{ width: 100 }}
      closable
      disableDragBeyondMinimumSnapPoint
      containerStyle={{ height: '95%', backgroundColor: theme.colors.surface }}
      springOffset={300}
    >
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            animating
            color={theme.colors.primary}
          />
        </View>
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text>Ett fel uppstod</Text>
        </View>
      ) : (
        <>
          <View style={styles.topBar}>
            <View style={styles.topBarInfo}>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurface }}
              >
                {data.bathingWater.name}
              </Text>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onSurface, marginBottom: 12 }}
              >
                {`${data.bathingWater.municipality.name} kommun`}
              </Text>
            </View>
            <View style={styles.topBarClose}>
              <IconButton
                icon={() => (
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={theme.colors.onSurface}
                  />
                )}
                onPress={() => SheetManager.hide('bathing-profile-sheet')}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={[styles.container]}>
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onSurface, marginBottom: 16 }}
            >
              {data.bathingWater.description}
            </Text>

            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginBottom: 8 }}
            >
              Badperiod
            </Text>
            <Text style={{ color: theme.colors.onSurface }}>
              {new Date(data.bathingSeason.startsAt).toLocaleDateString()} -{' '}
              {new Date(data.bathingSeason.endsAt).toLocaleDateString()}
            </Text>

            <Divider style={styles.divider} />

            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginBottom: 8 }}
            >
              Kvalitetsklassificering (senaste 4 åren)
            </Text>
            {data.lastFourClassifications.map((c) => (
              <Text key={c.year} style={{ color: theme.colors.onSurface }}>
                {c.year}: {c.qualityClassIdText}
              </Text>
            ))}

            <Divider style={styles.divider} />

            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginBottom: 8 }}
            >
              Kontaktinformation
            </Text>
            <Text style={{ color: theme.colors.onSurface }}>
              Kommun: {data.bathingWater.municipality.contactInfo.name}
            </Text>
            {data.bathingWater.municipality.contactInfo.email && (
              <Text style={{ color: theme.colors.onSurface }}>
                E-post: {data.bathingWater.municipality.contactInfo.email}
              </Text>
            )}
            {data.bathingWater.municipality.contactInfo.phone && (
              <Text style={{ color: theme.colors.onSurface }}>
                Telefon: {data.bathingWater.municipality.contactInfo.phone}
              </Text>
            )}

            <Divider style={styles.divider} />
            <Button
              mode="contained"
              onPress={() =>
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? `http://maps.apple.com/?daddr=${data.bathingWater.samplingPointPosition.latitude},${data.bathingWater.samplingPointPosition.longitude}&dirflg=d`
                    : `https://www.google.com/maps/dir/?api=1&destination=${data.bathingWater.samplingPointPosition.latitude},${data.bathingWater.samplingPointPosition.longitude}&travelmode=driving`
                )
              }
            >
              Navigera till badplats
            </Button>
          </ScrollView>
        </>
      )}
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
