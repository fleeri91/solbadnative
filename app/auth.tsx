import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>('')

  const router = useRouter()

  const theme = useTheme()

  const { signIn, signUp } = useAuth()

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Fyll i alla fält')
      return
    }

    if (password.length < 6) {
      setError('Lösenordet måste innehålla minst 6 tecken')
      return
    }

    setError(null)

    if (isSignUp) {
      const error = await signUp(email, password)
      if (error) {
        setError(error)
        return
      }
    } else {
      const error = await signIn(email, password)
      if (error) {
        setError(error)
        return
      }
    }

    router.replace('/')
  }

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? 'Skapa konto' : 'Välkommen tillbaka'}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="Lösenord"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? 'Skapa konto' : 'Logga in'}
        </Button>
        <Button
          mode="text"
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? 'Har du redan ett konto? Logga in'
            : 'Har du inte ett konto? Skapa här'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
})
