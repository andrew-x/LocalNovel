import { useToast } from '@/hooks/useToast'
import useZodForm from '@/hooks/useZodForm'
import { CommonProps } from '@/types/common'
import { Story } from '@/types/data'
import cn from '@/util/classnames'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
import { Button, Textarea } from '@mantine/core'
import { useEffect } from 'react'
import { z } from 'zod'

export default function AISettings({
  className,
  story,
}: CommonProps & {
  story: Story
}) {
  const { success, error } = useToast()

  const utils = trpc.useUtils()
  const { mutate, isLoading } = trpc.story.updateStory.useMutation({
    onSuccess() {
      success('Settings saved')
      utils.story.getStories.invalidate()
    },
    onError(err) {
      logError(err)
      error('Error saving settings')
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useZodForm({
    schema: z.object({
      plot: z.string(),
      style: z.string(),
    }),
  })
  const onSubmit = handleSubmit(({ plot, style }) => {
    mutate({ id: story.id, plot, style })
  })

  useEffect(() => reset(), [story])

  return (
    <form
      className={cn('flex flex-col gap-y-6', className)}
      onSubmit={onSubmit}
    >
      <Textarea
        label="Plot"
        rows={6}
        defaultValue={story.plot}
        error={errors.plot?.message}
        {...register('plot')}
      />
      <Textarea
        label="Writing Style"
        rows={6}
        defaultValue={story.style}
        error={errors.style?.message}
        {...register('style')}
      />
      <div className="center-col w-full py-2 sticky bottom-0 bg-slate-900">
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  )
}
