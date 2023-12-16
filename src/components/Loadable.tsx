import { CommonProps } from '@/types/common'
import { Loader } from '@mantine/core'
import { PropsWithChildren } from 'react'
import Alert from './Alert'

export type LoadableProps = PropsWithChildren<
  {
    isLoading?: boolean
    isError?: boolean
    isEmpty?: boolean
    emptyMessage?: string
  } & CommonProps
>
export default function Loadable({
  id,
  className,
  isLoading,
  isError,
  isEmpty,
  emptyMessage = 'No data yet',
  children,
}: LoadableProps) {
  return (
    <div id={id} className={className}>
      {isError ? (
        <div className="py-4">
          <Alert />
        </div>
      ) : isLoading ? (
        <div className="full-size center-content py-4">
          <Loader type="bars" />
        </div>
      ) : isEmpty ? (
        <p className="text-center text-lg font-semibold text-gray-500 py-4">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  )
}
