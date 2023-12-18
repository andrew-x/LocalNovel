import { DATA_PATH } from '@/util/constants.main'
import { shell } from 'electron'
import { removeSync } from 'fs-extra'
import { z } from 'zod'
import { Manifest, readManifest, updateManifest } from './utils/manifest'
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
  updateConfig: procedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(({ input: { url } }) => {
      const manifest = updateManifest(`config.url`, url)
      return manifest
    }),
})
export default adminRouter
