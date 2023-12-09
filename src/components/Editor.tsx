import { useToast } from '@/hooks/useToast'
import mainApi from '@/services/main'
import cn from '@/util/classnames'
import { logError } from '@/util/logger'
import { Button, TextInput } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { RichTextEditor } from '@mantine/tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

export function Editor({
  className,
  storyId,
  initialContent,
}: {
  className?: string
  storyId: string
  initialContent: string
}) {
  const { error } = useToast()
  const [updateContent] = mainApi.useUpdateContentMutation()
  const [value, setValue] = useDebouncedState(initialContent, 1000)

  useEffect(() => {
    updateContent({ id: storyId, content: value })
      .unwrap()
      .catch((err) => {
        logError(err)
        error('Could not save story')
      })
  }, [value])

  const editor = useEditor({
    content: initialContent,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML())
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'The start of something great...' }),
    ],
  })

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <RichTextEditor
        editor={editor}
        classNames={{
          typographyStylesProvider: 'prose prose-invert max-w-none',
        }}
      >
        <RichTextEditor.Content />
      </RichTextEditor>
      <div className="w-full center-row gap-x-2 sticky bottom-0 z-10 py-2 bg-slate-900">
        <TextInput className="grow" placeholder="Instructions" />
        <Button variant="light">Generate</Button>
      </div>
    </div>
  )
}
