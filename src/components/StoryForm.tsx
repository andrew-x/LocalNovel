import { useToast } from '@/hooks/useToast'
import useZodForm from '@/hooks/useZodForm'
import { Story } from '@/types/data'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
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
  const { error, success } = useToast()
  const navigate = useNavigate()

  const utils = trpc.useUtils()
  const { mutate: create, isLoading: isCreating } =
    trpc.story.createStory.useMutation({
      onSuccess(story) {
        success('Story created')
        utils.story.getStories.invalidate()
        navigate(`/story/${story.id}`)
        modals.closeAll()
      },
      onError(err) {
        logError(err)
        error()
      },
    })
  const { mutate: update, isLoading: isUpdating } =
    trpc.story.updateStory.useMutation({
      onSuccess(story) {
        success('Story updated')
        utils.story.getStories.invalidate()
        utils.story.getStory.invalidate({ id: story.id })
        modals.closeAll()
      },
      onError(err) {
        logError(err)
        error()
      },
    })
  const { mutate: deleteStory, isLoading: isDeleting } =
    trpc.story.deleteStory.useMutation({
      onSuccess(id) {
        success('Story deleted')
        utils.story.getStories.invalidate()
        utils.story.getStory.invalidate({ id })
        navigate('/')
        modals.closeAll()
      },
      onError(err) {
        logError(err)
        error()
      },
    })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
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

  const onSubmit = handleSubmit(async ({ title }) => {
    if (story) {
      update({ id: story.id, title })
    } else {
      create({ title })
    }
  })

  function onClick() {
    reset()
    modals.open({
      title: story ? 'Edit Story' : 'Create Story',
      children: (
        <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
          <TextInput
            label="Title"
            error={errors.title?.message}
            defaultValue={story?.title || ''}
            required
            {...register('title')}
          />
          <Button
            className="mx-auto"
            type="submit"
            loading={isCreating || isUpdating}
          >
            {story ? 'Save' : 'Create'}
          </Button>
          {story && (
            <Button
              className="mx-auto"
              variant="subtle"
              color="red"
              size="compact-xs"
              loading={isDeleting}
              onClick={() => {
                if (story) {
                  deleteStory({
                    id: story.id,
                  })
                }
              }}
            >
              Delete
            </Button>
          )}
        </form>
      ),
    })
  }

  return (
    <Button
      className={className}
      variant={story ? 'outline' : 'light'}
      color={story ? 'gray' : undefined}
      onClick={onClick}
    >
      {story ? 'Edit' : 'Create Story'}
    </Button>
  )
}
