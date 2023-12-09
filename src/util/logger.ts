import { IS_DEV } from './env'

export function logError(...data: unknown[]): void {
  if (!IS_DEV) {
    return
  }
  // eslint-disable-next-line no-console
  console.error(...data)
}

export function logInfo(...data: unknown[]): void {
  if (!IS_DEV) {
    return
  }
  // eslint-disable-next-line no-console
  console.info(...data)
}
