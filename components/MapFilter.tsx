import React, { useRef, useState } from 'react'
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import { Button, useTheme } from 'react-native-paper'

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

  const handleApply = () => {
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
      containerStyle={{
        ...styles.actionSheet,
        backgroundColor: theme.colors.surface,
      }}
      springOffset={300}
    >
      <TouchableWithoutFeedback
        style={{ backgroundColor: theme.colors.surface }}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View
          style={{
            ...styles.actionSheetcontainer,
            backgroundColor: theme.colors.surface,
          }}
        >
          <MunicipalitySearch
            value={localMapFilter.municipality || ''}
            onChange={(name) =>
              setLocalMapFilter((prev) => ({
                ...prev,
                municipality: name as MunicipalityName,
              }))
            }
          />
          <Button
            mode="contained"
            style={styles.applyButton}
            onPress={handleApply}
            disabled={!localMapFilter.municipality}
          >
            {'Välj kommun'}
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  actionSheet: {
    height: '90%',
  },
  actionSheetcontainer: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
  applyButton: {
    marginHorizontal: 16,
    marginVertical: '10%',
  },
})
