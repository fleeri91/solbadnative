import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'

interface Props {
  lottie?: React.ReactNode
  title?: string
  subtitle?: string
  description?: string
  button?: {
    title?: string
    onClick?: () => void
  }
}

export default function OnboardingSlide({
  lottie,
  title,
  subtitle,
  description,
  button,
}: Props) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      {lottie && <View style={styles.lottieContainer}>{lottie}</View>}
      {title && (
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text variant="titleMedium" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {description && (
        <Text variant="bodyLarge" style={styles.description}>
          {description}
        </Text>
      )}
      {button && (
        <View style={styles.buttonContainer}>
          <Button
            style={{ marginTop: 16 }}
            mode="contained"
            onPress={button.onClick}
          >
            {button.title}
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 48,
    alignItems: 'center',
    display: 'flex',
  },
  lottieContainer: {
    marginTop: '30%',
    marginBottom: 12,
    width: '100%',
    height: 200,
  },
  title: {
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    marginTop: 16,
  },
  buttonContainer: { marginTop: 'auto' },
})
