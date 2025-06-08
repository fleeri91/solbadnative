import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb', // Tailwind blue-600
    onPrimary: '#ffffff',
    secondary: '#f59e0b', // Tailwind amber-500
    onSecondary: '#000000',
    background: '#f9fafb', // Tailwind gray-100
    surface: '#ffffff', // Tailwind white
    onSurface: '#1f2937', // Tailwind gray-800
    error: '#dc2626', // Tailwind red-600
    onError: '#ffffff',
    outline: '#d1d5db', // Tailwind gray-300
    surfaceVariant: '#e5e7eb', // Tailwind gray-200
    onSurfaceVariant: '#374151', // Tailwind gray-700
  },
}

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3b82f6', // Tailwind blue-500
    onPrimary: '#000000',
    secondary: '#fcd34d', // Tailwind amber-300
    onSecondary: '#1f2937',
    background: '#0f172a', // Tailwind slate-900
    surface: '#1e293b', // Tailwind slate-800
    onSurface: '#f8fafc', // Tailwind slate-50
    error: '#ef4444', // Tailwind red-500
    onError: '#000000',
    outline: '#334155', // Tailwind slate-600
    surfaceVariant: '#475569', // Tailwind slate-700
    onSurfaceVariant: '#e2e8f0', // Tailwind slate-200
  },
}
