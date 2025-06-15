import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

import { useBathingWaters } from '@/lib/queries'
import { WatersAndAdvisory } from '@/types/BathingWater/BathingWaters'
import { SheetManager } from 'react-native-actions-sheet'

interface BathingWaterSearchProps {
  placeholder?: string
  label?: string
}

export default function BathingWaterSearch({
  placeholder = '',
  label = 'Sök badplats',
}: BathingWaterSearchProps) {
  const [query, setQuery] = useState('')
  const { colors } = useTheme()
  const { data, isLoading, isError } = useBathingWaters()

  const filteredData = useMemo(() => {
    if (!data || !query) return []

    const lower = query.toLowerCase()

    return data.watersAndAdvisories
      .filter(({ bathingWater }) => {
        const nameMatch = bathingWater.name.toLowerCase().startsWith(lower)
        const muniMatch = bathingWater.municipality.name
          .toLowerCase()
          .startsWith(lower)

        return nameMatch || muniMatch
      })
      .sort((a, b) => a.bathingWater.name.localeCompare(b.bathingWater.name))
      .slice(0, 20)
  }, [query, data])

  const handleSelect = (item: WatersAndAdvisory) => {
    setQuery(item.bathingWater.name)

    SheetManager.show('bathing-profile-sheet', {
      payload: { id: item.bathingWater.id },
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        label={label}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        mode="outlined"
        style={styles.input}
      />
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <List.Section>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.bathingWater.id}
              onPress={() => handleSelect(item)}
            >
              <List.Item
                title={item.bathingWater.name}
                description={item.bathingWater.municipality.name}
                titleStyle={{ color: colors.onSurface }}
              />
            </TouchableOpacity>
          ))}
        </List.Section>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 20,
  },
  input: {
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
})
