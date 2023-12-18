import AdminMenu from '@/components/AdminMenu'
import Loadable from '@/components/Loadable'
import StoryForm from '@/components/StoryForm'
import { trpc } from '@/util/trpc'
import { TextInput } from '@mantine/core'
import { useDebouncedValue, useInputState } from '@mantine/hooks'
import { MagnifyingGlass } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function Home() {
  const { data: stories, isLoading, isError } = trpc.story.getStories.useQuery()
  const [search, setSearch] = useInputState<string>('')
  const [debouncedSearch] = useDebouncedValue(search, 500)

  const show = useMemo(
    () =>
      (stories || []).filter(
        ({ title }) => title && title.includes(debouncedSearch)
      ),
    [stories, debouncedSearch]
  )

  return (
    <div className="p-4 flex flex-col gap-y-6 full-size">
      <div className="center-row gap-x-4 justify-between">
        <h1 className="text-4xl tracking-wider">✍️</h1>
        <div className="center-row gap-x-2">
          <StoryForm />
          <AdminMenu />
        </div>
      </div>
      <TextInput
        leftSection={<MagnifyingGlass />}
        value={search}
        onChange={setSearch}
      />
      <Loadable
        isLoading={isLoading}
        isError={isError}
        isEmpty={!stories || stories.length == 0}
      >
        {stories && (
          <ul className="grid grid-cols-12 gap-4">
            {show.map(({ id, title, updatedAt }, idx) => (
              <li
                key={idx}
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
              >
                <a
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 flex rounded flex-col gap-y-2"
                  href={`/story/${id}`}
                >
                  <p className="text-md">{title}</p>
                  <time className="text-xs text-slate-400">
                    {dayjs.unix(updatedAt).fromNow()}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Loadable>
    </div>
  )
}
