import { Story } from '@/types/data'
import { DATA_PATH } from '@/util/constants.main'
import dayjs from 'dayjs'
import { join } from 'path'
import { readManifest, updateManifest } from './manifest'

export function getStoryPath(id: string) {
  return join(DATA_PATH, `${id}.ln`)
}

export function recordVideoUpdate(id: string) {
  const story = readManifest(`stories.${id}`) as Story
  story.updatedAt = dayjs().unix()
  updateManifest(`stories.${id}`, story)
}
