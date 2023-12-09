import { useToast } from '@/hooks/useToast'
import useZodForm from '@/hooks/useZodForm'
import mainApi from '@/services/main'
import { Story } from '@/types/data'
import { logError } from '@/util/logger'
import { Button, TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

export default function StoryForm({
  className,
  story,
}: {
  className?: string
  story?: Story
}) {
  const { error } = useToast()
  const navigate = useNavigate()

  const [create] = mainApi.useCreateStoryMutation()
  const [update] = mainApi.useUpdateStoryMutation()
  const [deleteStory, { isLoading: isDeleting }] =
    mainApi.useDeleteStoryMutation()

  const {
    register,
    formState: { errors, isLoading },
    handleSubmit,
    reset,
    control,
  } = useZodForm({
    schema: z.object({
      title: z.string().min(1, 'Name is required'),
      tags: z.array(z.string()),
    }),
    defaultValues: {
      title: story?.title || '',
      tags: story?.tags || [],
    },
  })

  const onSubmit = handleSubmit(async ({ title, tags }) => {
    try {
      const next: Story = story
        ? await update({ id: story.id, title, tags }).unwrap()
        : await create({
            title,
            tags,
          }).unwrap()
      modals.closeAll()
      navigate(`/story/${next?.id || ''}`)
    } catch (err) {
      logError(err)
    }
  })

  async function onDelete() {
    try {
      if (story) {
        await deleteStory(story.id).unwrap()
      }
      modals.closeAll()
      navigate('/')
    } catch (err) {
      logError(err)
      error()
    }
  }

  function onClick() {
    reset()
    modals.open({
      title: 'Create Video',
      children: (
        <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
          <TextInput
            label="Title"
            error={errors.title?.message}
            defaultValue={story?.title || ''}
            required
            {...register('title')}
          />
          <Button className="mx-auto" type="submit" loading={isLoading}>
            {story ? 'Save' : 'Create'}
          </Button>
          {story && (
            <Button
              className="mx-auto"
              variant="subtle"
              color="red"
              size="compact-xs"
              loading={isDeleting}
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </form>
      ),
    })
  }

  return (
    <Button className={className} variant="light" onClick={onClick}>
      {story ? 'Edit' : 'Create Story'}
    </Button>
  )
}
