import { app } from 'electron'
import path from 'path'
import { IS_DEV } from './env'

export const DATA_PATH = path.join(
  app.getPath('userData'),
  IS_DEV ? 'localnovel-dev-data' : 'localnovel-data'
)
export const MANIFEST_PATH = path.join(DATA_PATH, 'manifest.json')
