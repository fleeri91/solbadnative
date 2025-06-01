import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

import { useBathingWaters } from '@/lib/queries'
import { WatersAndAdvisory } from '@/types/BathingWater/BathingWaters'
import { WaterTypeId } from '@/types/BathingWater/WaterType'
import { SheetManager } from 'react-native-actions-sheet'

interface BathingWaterSearchProps {
  placeholder?: string
  label?: string
  waterType: WaterTypeId
}

export default function BathingWaterSearch({
  placeholder = 'Sök badplats',
  label = '',
  waterType,
}: BathingWaterSearchProps) {
  const [query, setQuery] = useState('')
  const { colors } = useTheme()
  const { data, isLoading, isError } = useBathingWaters()

  const filteredData = useMemo(() => {
    if (!data || !query) return []

    const isSea = waterType === 1
    const lower = query.toLowerCase()

    return data.watersAndAdvisories
      .filter(({ bathingWater }) => {
        const nameMatch = bathingWater.name.toLowerCase().startsWith(lower) // stricter start match
        const muniMatch = bathingWater.municipality.name
          .toLowerCase()
          .startsWith(lower) // stricter start match
        const typeMatch = isSea
          ? bathingWater.waterTypeId === 1
          : bathingWater.waterTypeId === 3

        return (nameMatch || muniMatch) && typeMatch
      })
      .sort((a, b) => a.bathingWater.name.localeCompare(b.bathingWater.name)) // ascending sort
      .slice(0, 20)
  }, [query, data, waterType])

  const handleSelect = (item: WatersAndAdvisory) => {
    setQuery(item.bathingWater.name)

    SheetManager.show('bathing-profile-sheet', {
      payload: { id: item.bathingWater.id },
    })
  }

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        mode="outlined"
        style={styles.input}
        disabled={isLoading || isError}
      />

      {filteredData.length > 0 && (
        <ScrollView
          style={styles.listContainer}
          keyboardShouldPersistTaps="handled"
        >
          <List.Section style={styles.list}>
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
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    marginBottom: 5,
  },
  listContainer: {
    maxHeight: 200,
    borderRadius: 4,
    elevation: 2,
  },
  list: {
    borderRadius: 4,
  },
})
