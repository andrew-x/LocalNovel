import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import './app'

export const client = createTRPCProxyClient({
  links: [ipcLink()],
})
