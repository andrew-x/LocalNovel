import { notifications } from '@mantine/notifications'
import { useCallback } from 'react'

export function useToast() {
  const success = useCallback((message: string) => {
    notifications.show({
      color: 'green',
      message,
    })
  }, [])
  const error = useCallback(
    (message = 'Unexpected error, please try again later') => {
      notifications.show({
        color: 'red',
        message,
      })
    },
    []
  )

  return { success, error }
}
