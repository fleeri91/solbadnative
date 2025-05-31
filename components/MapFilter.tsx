import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import { useTheme } from 'react-native-paper'

import MunicipalitySearch from './MunicipalitySearch'

export default function MapFilter() {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const theme = useTheme()

  return (
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled={true}
      indicatorStyle={{
        width: 100,
      }}
      snapPoints={[90]}
    >
      <View style={styles.actionSheetcontainer}>
        <MunicipalitySearch />
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  actionSheetcontainer: {
    width: '100%',
    height: '100%',
  },
})
