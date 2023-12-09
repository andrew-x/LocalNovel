import StoryForm from '@/components/StoryForm'
import mainApi from '@/services/main'
import { ActionIcon, Menu, TextInput } from '@mantine/core'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { DotsThreeVertical } from '@phosphor-icons/react/dist/ssr'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function Home() {
  const { data: stories } = mainApi.useGetStoriesQuery()
  const [openAppFolder] = mainApi.useOpenAppFolderMutation()
  const [wipeData] = mainApi.useWipeDataMutation()

  const show = useMemo(() => stories || [], [stories])

  return (
    <div className="p-4 flex flex-col gap-y-6 full-size">
      <div className="center-row gap-x-4 justify-between">
        <h1 className="text-4xl tracking-wider">✍️</h1>
        <div className="center-row gap-x-2">
          <StoryForm />
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <DotsThreeVertical size={30} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => wipeData()}>Clear Database</Menu.Item>
              <Menu.Item onClick={() => openAppFolder()}>
                Open App Folder
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <TextInput leftSection={<MagnifyingGlass />} />
      {stories && stories.length > 0 ? (
        <ul className="grid grid-cols-12">
          {show.map(({ id, title, tags, updatedAt }, idx) => (
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
                  {dayjs(updatedAt).format('MMM DD, YYYY')}
                </time>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-4 text-lg text-slate-400">
          No stories yet, start writing now!
        </p>
      )}
    </div>
  )
}
