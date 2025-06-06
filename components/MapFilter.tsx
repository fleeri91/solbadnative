import React, { useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper'

import { MunicipalityName } from '@/constants/municipalities'
import { MapFilterState, useMapFilterStore } from '@/store/useMapFilter'
import MunicipalitySearch from './MunicipalitySearch'

export default function MapFilter() {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const { setMapFilter } = useMapFilterStore()

  const [localMapFilter, setLocalMapFilter] = useState<MapFilterState>({
    municipality: null,
    maxDistance: null,
    filterMode: null,
  })

  const theme = useTheme()

  // Handler for maxDistance input changes
  const handleMaxDistanceChange = (value: string) => {
    // Remove any non-digit characters, allow decimals
    const numericValue = value.replace(/[^0-9.]/g, '')

    // Parse to float or null if empty
    const parsed = numericValue ? parseFloat(numericValue) : null

    setLocalMapFilter((prev) => ({
      ...prev,
      maxDistance: parsed,
    }))
  }

  const handleApply = () => {
    if (!localMapFilter.filterMode) return
    if (
      localMapFilter.filterMode === 'municipality' &&
      !localMapFilter.municipality
    )
      return
    if (
      localMapFilter.filterMode === 'nearby' &&
      (localMapFilter.maxDistance === null || localMapFilter.maxDistance <= 0)
    )
      return

    setMapFilter(localMapFilter)
    actionSheetRef.current?.hide()
  }

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
      <View style={styles.actionSheetcontainer}>
        <Text>Hur vill du hitta badplats?</Text>

        <SafeAreaView>
          <SegmentedButtons
            value={localMapFilter.filterMode || ''}
            onValueChange={(value) =>
              setLocalMapFilter((prev) => ({
                ...prev,
                filterMode: value as MapFilterState['filterMode'],
                // Reset fields on mode change
                municipality:
                  value === 'municipality' ? prev.municipality : null,
                maxDistance: value === 'nearby' ? prev.maxDistance : null,
              }))
            }
            buttons={[
              { value: 'nearby', label: 'Nära dig' },
              { value: 'municipality', label: 'Kommun' },
            ]}
          />
        </SafeAreaView>

        {localMapFilter.filterMode === 'municipality' && (
          <MunicipalitySearch
            value={localMapFilter.municipality || ''}
            onChange={(name) =>
              setLocalMapFilter((prev) => ({
                ...prev,
                municipality: name as MunicipalityName,
              }))
            }
          />
        )}

        {localMapFilter.filterMode === 'nearby' && (
          <TextInput
            label="Max avstånd (km)"
            mode="outlined"
            keyboardType="numeric"
            value={
              localMapFilter.maxDistance !== null
                ? localMapFilter.maxDistance.toString()
                : ''
            }
            onChangeText={handleMaxDistanceChange}
            style={{ marginTop: 16, marginHorizontal: 16 }}
          />
        )}

        <Button
          mode="contained"
          style={styles.applyButton}
          onPress={handleApply}
          disabled={
            !localMapFilter.filterMode ||
            (localMapFilter.filterMode === 'municipality' &&
              !localMapFilter.municipality) ||
            (localMapFilter.filterMode === 'nearby' &&
              (localMapFilter.maxDistance === null ||
                localMapFilter.maxDistance <= 0))
          }
        >
          Använd filter
        </Button>
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  actionSheetcontainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    padding: 16,
  },
  applyButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
})
