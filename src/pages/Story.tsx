import { Editor } from '@/components/Editor'
import StoryForm from '@/components/StoryForm'
import mainApi from '@/services/main'
import { ActionIcon, Loader } from '@mantine/core'
import { ArrowLeft } from '@phosphor-icons/react'
import { useParams } from 'react-router'

export default function StoryPage() {
  const { id } = useParams()
  const {
    data: story,
    isLoading: isLoadingStory,
    isError: isErrorStory,
  } = mainApi.useGetStoryQuery(id || '')
  const {
    data: content,
    isLoading: isLoadingContent,
    isError: isErrorContent,
  } = mainApi.useLoadContentQuery(id || '')

  return isLoadingStory || isLoadingContent ? (
    <div className="center-content py-10">
      <Loader type="bars" />
    </div>
  ) : isErrorStory || isErrorContent ? (
    <div className="center-content py-10">
      <p className="text-red-400 text-lg font-medium">Something went wrong.</p>
    </div>
  ) : (
    <div className="flex flex-col full-size p-4 gap-y-2">
      <div className="center-row gap-x-2 sticky top-0 z-10 bg-slate-900 py-2">
        <ActionIcon variant="subtle" component="a" href="/">
          <ArrowLeft />
        </ActionIcon>
        <h1 className="text-2xl font-light tracking-wide">{story?.title}</h1>
        <StoryForm className="ml-auto" story={story} />
      </div>
      <Editor
        className="grow"
        storyId={story?.id || ''}
        initialContent={content || ''}
      />
    </div>
  )
}
