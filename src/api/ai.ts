import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { Manifest, readManifest } from './utils/manifest'
import { procedure, router } from './_trpc'

function truncateTextBySentences(text: string, sentenceCount: number): string {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g)

  if (!sentences || sentences.length <= sentenceCount) {
    return text
  }

  return sentences.slice(-sentenceCount).join(' ').trim()
}

const aiRouter = router({
  generate: procedure
    .input(
      z.object({
        id: z.string(),
        instructions: z.string().optional(),
        content: z.string(),
      })
    )
    .mutation(async ({ input: { id, instructions, content } }) => {
      const manifest = readManifest() as Manifest
      const story = manifest.stories[id]
      const url = manifest.config.url
      if (!story) {
        throw new Error(`Story not found`)
      }

      const truncated = truncateTextBySentences(content, 50)

      const { plot, style } = story
      const prompt = `
      You are writing an engaging and award-winning story.

      The plot of the story is:
      ${plot}

      Your writing should adhere to the following style:
      ${style}
      
      The story so far:
      ${truncated}

      {
        instructions ? 
        Additional instructions:
        ${instructions}
        :
        ''
      }

      Continue the story in a logical way according to the plot and style.
      `

      // const response = await axios.post(url, {
      //   prompt,
      // })

      return faker.lorem.paragraphs(2)
    }),
})
export default aiRouter
