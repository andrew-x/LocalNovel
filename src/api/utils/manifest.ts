import { Story } from '@/types/data'
import { DATA_PATH } from '@/util/constants.main'
import {
  ensureFileSync,
  existsSync,
  readJSONSync,
  writeJSONSync,
} from 'fs-extra'
import { get, set, unset } from 'lodash'
import { join } from 'path'

export const MANIFEST_PATH = join(DATA_PATH, 'manifest.json')

export type Manifest = {
  stories: Record<string, Story>
  config: {
    url: string
  }
}

export function readManifest(path?: string) {
  if (!existsSync(MANIFEST_PATH)) {
    const defaultManifest: Manifest = {
      stories: {},
      config: {
        url: 'http://localhost:5000/api',
      },
    }
    ensureFileSync(MANIFEST_PATH)
    writeJSONSync(MANIFEST_PATH, defaultManifest)
  }
  const manifest = readJSONSync(MANIFEST_PATH) as Manifest
  return path ? get(manifest, path) : manifest
}

export function updateManifest(path: string, value: unknown) {
  const manifest = readJSONSync(MANIFEST_PATH) as Manifest
  set(manifest, path, value)
  writeJSONSync(MANIFEST_PATH, manifest)
  return manifest
}

export function deleteManifest(path: string) {
  const manifest = readJSONSync(MANIFEST_PATH) as Manifest
  unset(manifest, path)
  writeJSONSync(MANIFEST_PATH, manifest)
  return manifest
}
