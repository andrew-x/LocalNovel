// See the Electron documentation for details on how to use preload scripts:
import { exposeElectronTRPC } from 'electron-trpc/main'

process.once('loaded', () => {
  exposeElectronTRPC()
})
