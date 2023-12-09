import { Story } from '@/types/data'
import { DATA_PATH, MANIFEST_PATH } from '@/util/constants.main'
import { nanoid } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import fs from 'fs-extra'
import path from 'path'

export function getStories() {
  const manifest = fs.readJsonSync(MANIFEST_PATH)
  const stories = manifest.stories as Record<string, Story>
  return Object.values(stories).sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getStory(id: string) {
  const manifest = fs.readJsonSync(MANIFEST_PATH)
  const stories = manifest.stories as Record<string, Story>
  return stories[id]
}

export function createStory(title: string, tags: string[]) {
  const story: Story = {
    id: nanoid(),
    title,
    tags,
    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf(),
  }

  const manifest = fs.readJsonSync(MANIFEST_PATH)
  const next = {
    ...manifest,
    stories: {
      ...manifest.stories,
      [story.id]: story,
    },
  }
  fs.writeJSONSync(MANIFEST_PATH, next)
  return story
}

export function updateStory(story: Partial<Story> & { id: string }) {
  const manifest = fs.readJsonSync(MANIFEST_PATH)
  const nextStory = {
    ...manifest.stories[story.id],
    ...story,
    updatedAt: dayjs().valueOf(),
  }
  const next = {
    ...manifest,
    stories: {
      ...manifest.stories,
      [story.id]: nextStory,
    },
  }
  fs.writeJSONSync(MANIFEST_PATH, next)
  return nextStory
}

export function deleteStory(id: string) {
  const manifest = fs.readJsonSync(MANIFEST_PATH)
  const next = {
    ...manifest,
    stories: Object.fromEntries(
      Object.entries(manifest.stories).filter(([key]) => key !== id)
    ),
  }
  fs.writeJSONSync(MANIFEST_PATH, next)
  fs.removeSync(path.join(DATA_PATH, `${id}.ln`))
}
