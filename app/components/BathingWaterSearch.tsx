import { useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

import { useBathingWaters } from '@/lib/queries'
import { WatersAndAdvisory } from '@/types/BathingWater/BathingWaters'
import { WaterTypeId } from '@/types/BathingWater/WaterType'

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
        const nameMatch = bathingWater.name.toLowerCase().includes(lower)
        const muniMatch = bathingWater.municipality.name
          .toLowerCase()
          .includes(lower)
        const typeMatch = isSea
          ? bathingWater.waterTypeId === 1
          : bathingWater.waterTypeId === 3

        return (nameMatch || muniMatch) && typeMatch
      })
      .slice(0, 20)
  }, [query, data, waterType])

  const handleSelect = (item: WatersAndAdvisory) => {
    setQuery(item.bathingWater.name)
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
  list: {
    elevation: 2,
    borderRadius: 4,
  },
})
