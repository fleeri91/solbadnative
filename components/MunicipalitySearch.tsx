import { municipalities, MunicipalityName } from '@/constants/municipalities'
import { useMapFilterStore } from '@/store/useMapFilter'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

export default function MunicipalitySearch() {
  const { municipality, setMunicipality } = useMapFilterStore()
  const [query, setQuery] = useState('')
  const { colors } = useTheme()

  const filteredMunicipalities = useMemo(() => {
    if (!query) return []
    const lower = query.toLowerCase()
    return municipalities
      .filter((name) => name.toLowerCase().startsWith(lower))
      .sort((a, b) => a.localeCompare(b)) // Sort ascending alphabetically
      .slice(0, 20)
  }, [query])

  const handleSelect = (name: MunicipalityName) => {
    setMunicipality(name)
    setQuery(name)
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Välj kommun"
        placeholder="Sök kommun"
        value={query}
        onChangeText={setQuery}
        mode="outlined"
        style={styles.input}
      />

      {filteredMunicipalities.length > 0 && (
        <ScrollView
          style={styles.listContainer}
          keyboardShouldPersistTaps="handled"
        >
          <List.Section style={styles.list}>
            {filteredMunicipalities.map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => handleSelect(name as MunicipalityName)}
              >
                <List.Item
                  title={name}
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
  list: {
    elevation: 2,
    borderRadius: 4,
  },
  listContainer: {
    maxHeight: 200,
    borderRadius: 4,
    elevation: 2,
  },
})
