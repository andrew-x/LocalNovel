import { Story } from '@/types/data'
import dayjs from 'dayjs'
import {
  ensureFileSync,
  existsSync,
  readJSONSync,
  removeSync,
  writeJSONSync,
} from 'fs-extra'
import uniqid from 'uniqid'
import { z } from 'zod'
import {
  deleteManifest,
  Manifest,
  readManifest,
  updateManifest,
} from './utils/manifest'
import { getStoryPath } from './utils/story'
import { procedure, router } from './_trpc'

const storyRouter = router({
  getStories: procedure.query<Story[]>(() => {
    const stories = readManifest('stories') as Manifest['stories']
    return Object.values(stories).sort((a, b) => b.updatedAt - a.updatedAt)
  }),
  getStory: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      const story = readManifest(`stories.${id}`) as Story
      if (!story) throw new Error('Story not found')
      return story
    }),
  createStory: procedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input: { title } }) => {
      const story: Story = {
        id: uniqid(),
        title,
        tags: [],

        updatedAt: dayjs().unix(),
        createdAt: dayjs().unix(),
      }
      updateManifest(`stories.${story.id}`, story)
      return story
    }),
  updateStory: procedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(({ input: { id, title } }) => {
      const story: Partial<Story> = {
        id,
        title,
        updatedAt: dayjs().unix(),
      }
      const updated = updateManifest(`stories.${id}`, story)
      return updated.stories[id]
    }),
  deleteStory: procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input: { id } }) => {
      removeSync(getStoryPath(id))
      deleteManifest(`stories.${id}`)
      return id
    }),

  getContent: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id } }) => {
      if (!existsSync(getStoryPath(id))) {
        writeJSONSync(getStoryPath(id), {
          type: 'doc',
          content: [],
        })
        return {}
      } else {
        const content = readJSONSync(getStoryPath(id))
        return content
      }
    }),
  updateContent: procedure
    .input(z.object({ id: z.string(), content: z.any() }))
    .mutation(({ input: { id, content } }) => {
      ensureFileSync(getStoryPath(id))
      writeJSONSync(getStoryPath(id), content)

      updateManifest(`stories.${id}.updatedAt`, dayjs().unix())
      return content
    }),
})
export default storyRouter
