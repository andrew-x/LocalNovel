import { useToast } from '@/hooks/useToast'
import useZodForm from '@/hooks/useZodForm'
import { CommonProps } from '@/types/common'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
import { Button, TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import { z } from 'zod'

export default function Generate({
  storyId,
  content,
  onGenerate,
}: CommonProps & {
  storyId: string
  content: string
  onGenerate: (content: string) => void
}) {
  const { error } = useToast()
  const { mutate: generate } = trpc.ai.generate.useMutation({
    onSuccess(generated, { instructions }) {
      modals.open({
        size: 'lg',
        title: 'Generated Text',
        children: (
          <div className="flex flex-col gap-y-4">
            <p className="text-slate-500">
              This is what's auto-generated, do you want to add this to the
              story?
            </p>
            <p>{generated}</p>
            <Button.Group className="mx-auto">
              <Button
                variant="outline"
                color="purple"
                onClick={() => {
                  generate({
                    id: storyId,
                    content,
                    instructions,
                  })
                  modals.closeAll()
                }}
              >
                Regenerate
              </Button>
              <Button
                onClick={() => {
                  onGenerate(generated)
                  modals.closeAll()
                }}
              >
                Accept
              </Button>
            </Button.Group>
          </div>
        ),
      })
    },
    onError(err) {
      logError(err)
      error()
    },
  })
  const { register, handleSubmit } = useZodForm({
    schema: z.object({
      instructions: z.string().optional(),
    }),
  })

  const onSubmit = handleSubmit(({ instructions }) => {
    generate({
      id: storyId,
      content,
      instructions,
    })
  })

  return (
    <>
      <form
        className="w-full center-row gap-x-2 sticky bottom-0 z-10 py-2 bg-slate-900"
        onSubmit={onSubmit}
      >
        <TextInput
          className="grow"
          placeholder="Instructions"
          {...register('instructions')}
        />
        <Button variant="light" type="submit">
          Generate
        </Button>
      </form>
    </>
  )
}
