import { municipalities, MunicipalityName } from '@/constants/municipalities'
import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { List, TextInput, useTheme } from 'react-native-paper'

interface Props {
  value: MunicipalityName | ''
  onChange: (name: MunicipalityName) => void
}

export default function MunicipalitySearch({ value, onChange }: Props) {
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState<string>(value || '')

  const filteredMunicipalities = useMemo(() => {
    const lower = searchQuery.toLowerCase()
    const filtered = searchQuery
      ? municipalities.filter((name) => name.toLowerCase().startsWith(lower))
      : municipalities

    return [...filtered].sort((a, b) => a.localeCompare(b))
  }, [searchQuery])

  const handleSelect = (name: MunicipalityName) => {
    onChange(name)
    setSearchQuery(name)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        label="Sök kommun"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
      />
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <List.Section>
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
})
