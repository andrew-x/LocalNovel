import { useToast } from '@/hooks/useToast'
import cn from '@/util/classnames'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
import { Button, TextInput } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { RichTextEditor } from '@mantine/tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import { JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

export function Editor({
  className,
  storyId,
  initialContent,
}: {
  className?: string
  storyId: string
  initialContent: any
}) {
  const { error } = useToast()
  const utils = trpc.useUtils()
  const { mutate: updateContent } = trpc.story.updateContent.useMutation({
    onSuccess() {
      utils.story.invalidate()
    },
    onError(err) {
      logError(err)
      error()
    },
  })
  const [value, setValue] = useDebouncedState<JSONContent>(initialContent, 1000)

  useEffect(() => {
    updateContent({ id: storyId, content: value })
  }, [value])

  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => {
      setValue(editor.getJSON())
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
