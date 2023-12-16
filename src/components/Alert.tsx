import { CommonProps } from '@/types/common'
import { Alert as MantineAlert } from '@mantine/core'
import { AlertCircle, AlertTriangle, CheckCircle, InfoIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

export default function Alert({
  id,
  className,
  title = 'Something went wrong',
  type = 'error',
  children = 'Please try again later',
}: PropsWithChildren<
  CommonProps & {
    title?: string
    type?: 'info' | 'success' | 'warning' | 'error'
  }
>) {
  return (
    <MantineAlert
      id={id}
      className={className}
      color={
        type === 'info'
          ? 'blue'
          : type === 'success'
            ? 'green'
            : type === 'warning'
              ? 'yellow'
              : 'red'
      }
      title={title}
      icon={
        type === 'info' ? (
          <InfoIcon />
        ) : type === 'success' ? (
          <CheckCircle />
        ) : type === 'warning' ? (
          <AlertTriangle />
        ) : (
          <AlertCircle />
        )
      }
    >
      {children}
    </MantineAlert>
  )
}
