import { useQuery } from '@tanstack/react-query'

import { getBathingWaters } from './api'

export const queryKeys = {
  bathingWaters: ['bathingWaters'],
}

export const useBathingWaters = () => {
  return useQuery({
    queryKey: queryKeys.bathingWaters,
    queryFn: getBathingWaters,
    staleTime: 1000 * 60 * 60 * 24,
    refetchInterval: 1000 * 30,
  })
}
