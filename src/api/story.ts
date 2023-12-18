import { Story } from '@/types/data'
import { EMPTY_CONTENT } from '@/util/constants.render'
import dayjs from 'dayjs'
import {
  ensureFileSync,
  existsSync,
  readJSONSync,
  removeSync,
  writeJSONSync,
} from 'fs-extra'
import pickBy from 'lodash/pickBy'
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

        plot: '',
        style: '',

        updatedAt: dayjs().unix(),
        createdAt: dayjs().unix(),
      }
      updateManifest(`stories.${story.id}`, story)
      return story
    }),
  updateStory: procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        plot: z.string().optional(),
        style: z.string().optional(),
      })
    )
    .mutation(({ input: { id, title, plot, style } }) => {
      const current = readManifest(`stories.${id}`) as Story

      const story: Partial<Story> = {
        id,
        title,
        plot,
        style,
        updatedAt: dayjs().unix(),
      }

      const updated = updateManifest(`stories.${id}`, {
        ...current,
        ...pickBy(story, (value) => value !== undefined),
      })
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
        writeJSONSync(getStoryPath(id), EMPTY_CONTENT)
        return EMPTY_CONTENT
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
