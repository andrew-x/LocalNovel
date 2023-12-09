import { DATA_PATH } from '@/util/constants.main'
import fs from 'fs-extra'
import path from 'path'

export function loadContent(id: string) {
  const filepath = path.join(DATA_PATH, `${id}.ln`)
  fs.ensureFileSync(filepath)
  return fs.readFileSync(filepath, { encoding: 'utf-8' })
}

export function updateContent(id: string, content: string) {
  const filepath = path.join(DATA_PATH, `${id}.ln`)
  fs.writeFileSync(filepath, content, { encoding: 'utf-8' })
}
