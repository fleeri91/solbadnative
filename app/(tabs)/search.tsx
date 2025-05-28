import { WaterTypeId } from '@/types/BathingWater/WaterType'
import { useState } from 'react'
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import Autocomplete from '../components/BathingWaterSearch'

export default function SearchView() {
  const [segment, setSegment] = useState<string>('sea')

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={segment}
          onValueChange={setSegment}
          style={styles.segmentedButtons}
          buttons={[
            {
              value: 'sea',
              label: 'Hav',
            },
            {
              value: 'lake',
              label: 'Sjö',
            },
          ]}
        />

        <View style={styles.content}>
          <Autocomplete
            waterType={segment === 'sea' ? WaterTypeId.HAV : WaterTypeId.SJÖ}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  segmentedButtons: {
    padding: 24,
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
})
