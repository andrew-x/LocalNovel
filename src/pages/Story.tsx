import AISettings from '@/components/AISettings'
import { Editor } from '@/components/Editor'
import Loadable from '@/components/Loadable'
import StoryForm from '@/components/StoryForm'
import { trpc } from '@/util/trpc'
import { ActionIcon, Tabs } from '@mantine/core'
import { ArrowLeft } from '@phosphor-icons/react'
import { useState } from 'react'
import { useParams } from 'react-router'

export default function StoryPage() {
  const { id } = useParams<{ id: string }>()
  const {
    data: story,
    isLoading: isLoadingStory,
    isError: isErrorStory,
  } = trpc.story.getStory.useQuery({ id: id || '' }, { enabled: !!id })
  const {
    data: content,
    isLoading: isLoadingContent,
    isError: isErrorContent,
  } = trpc.story.getContent.useQuery({ id: id || '' }, { enabled: !!id })
  const [tab, setTab] = useState<'editor' | 'ai'>('editor')

  return (
    <div className="flex flex-col full-size p-4 gap-y-2">
      <div className="center-row gap-x-2 sticky top-0 z-10 bg-slate-900 py-2">
        <ActionIcon variant="subtle" component="a" href="/">
          <ArrowLeft />
        </ActionIcon>
        <h1 className="text-2xl font-light tracking-wide">{story?.title}</h1>
        <nav className="grow flex justify-center">
          <Tabs
            value={tab}
            onChange={(next) => setTab(next === 'ai' ? 'ai' : 'editor')}
          >
            <Tabs.List>
              <Tabs.Tab value="editor">Editor</Tabs.Tab>
              <Tabs.Tab value="ai">AI Settings</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </nav>
        <StoryForm className="ml-auto" story={story} />
      </div>
      <Loadable
        isLoading={isLoadingStory || isLoadingContent}
        isError={isErrorStory || isErrorContent}
      >
        {!story || !content ? null : tab === 'ai' ? (
          <AISettings className="grow" story={story} />
        ) : (
          <Editor
            className="grow"
            storyId={story.id}
            initialContent={content}
          />
        )}
      </Loadable>
    </div>
  )
}
