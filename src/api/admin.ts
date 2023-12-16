import { DATA_PATH } from '@/util/constants.main'
import { shell } from 'electron'
import { removeSync } from 'fs-extra'
import { Manifest, readManifest } from './utils/manifest'
import { procedure, router } from './_trpc'

const adminRouter = router({
  openAppDir: procedure.mutation(async () => {
    shell.openPath(DATA_PATH)
  }),
  resetApp: procedure.mutation(async () => {
    removeSync(DATA_PATH)
  }),

  getConfig: procedure.query(() => {
    const config = readManifest('config') as Manifest['config']
    return config
  }),
})
export default adminRouter
