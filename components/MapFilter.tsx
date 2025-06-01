import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import { Button, useTheme } from 'react-native-paper'

import { MunicipalityName } from '@/constants/municipalities'
import { useMapFilterStore } from '@/store/useMapFilter'
import MunicipalitySearch from './MunicipalitySearch'

export default function MapFilter() {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const { setMunicipality } = useMapFilterStore()
  const [localMunicipality, setLocalMunicipality] = useState<
    MunicipalityName | ''
  >('')
  const theme = useTheme()

  const handleApply = () => {
    if (localMunicipality) {
      setMunicipality(localMunicipality)
      actionSheetRef.current?.hide()
    }
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
        <MunicipalitySearch
          value={localMunicipality}
          onChange={(name) => setLocalMunicipality(name as MunicipalityName)}
        />

        <Button
          mode="contained"
          style={styles.applyButton}
          onPress={handleApply}
          disabled={!localMunicipality}
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
    paddingTop: 16,
  },
  applyButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
})
