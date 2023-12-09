import { DATA_PATH } from '@/util/constants.main'
import fs from 'fs-extra'

export function wipeData() {
  fs.emptyDirSync(DATA_PATH)
}
