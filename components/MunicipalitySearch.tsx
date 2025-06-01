import { municipalities, MunicipalityName } from '@/constants/municipalities'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

interface Props {
  value: MunicipalityName | ''
  onChange: (name: MunicipalityName) => void
}

export default function MunicipalitySearch({ value, onChange }: Props) {
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState<string>(value || '')

  const filteredMunicipalities = useMemo(() => {
    if (!searchQuery) return []
    const lower = searchQuery.toLowerCase()
    return municipalities
      .filter((name) => name.toLowerCase().startsWith(lower))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 20)
  }, [searchQuery])

  const handleSelect = (name: MunicipalityName) => {
    onChange(name)
    setSearchQuery(name)
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Välj kommun"
        placeholder="Sök kommun"
        value={searchQuery}
        onChangeText={setSearchQuery}
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
              <TouchableOpacity key={name} onPress={() => handleSelect(name)}>
                <List.Item
                  title={name}
                  titleStyle={{
                    color: colors.onSurface,
                    fontWeight: name === value ? 'bold' : 'normal',
                  }}
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
    paddingHorizontal: 16,
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
    marginBottom: 10,
  },
})
