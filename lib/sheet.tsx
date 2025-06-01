import BathingProfile from '@/components/BathingProfile'
import MapFilter from '@/components/MapFilter'
import { registerSheet, SheetDefinition } from 'react-native-actions-sheet'

registerSheet('map-filter-sheet', MapFilter)
registerSheet('bathing-profile-sheet', BathingProfile)

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'map-filter-sheet': SheetDefinition
    'bathing-profile-sheet': SheetDefinition
  }
}

export {}
