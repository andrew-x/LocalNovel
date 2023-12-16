import { useToast } from '@/hooks/useToast'
import { CommonProps } from '@/types/common'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
import { ActionIcon, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { MoreVertical } from 'lucide-react'

export default function AdminMenu({ className }: CommonProps) {
  const { success, error } = useToast()

  const utils = trpc.useUtils()
  const { mutate: openAppDir } = trpc.admin.openAppDir.useMutation({
    onError: (err) => {
      logError(err)
      error('Error opening app directory')
    },
  })
  const { mutate: resetApp } = trpc.admin.resetApp.useMutation({
    onSuccess: () => {
      utils.invalidate()
      success('App reset')
    },
    onError: (err) => {
      logError(err)
      error('Error resetting app')
    },
  })

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" className={className}>
          <MoreVertical color="gray" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => openAppDir()}>Open App Folder</Menu.Item>
        <Menu.Item
          onClick={() => {
            modals.openConfirmModal({
              title: 'Reset App?',
              children:
                'Are you sure you want to reset the app? This is irreversible.',
              labels: { confirm: 'Yes, reset app', cancel: 'Cancel' },
              confirmProps: { color: 'red' },
              onConfirm: () => resetApp(),
            })
          }}
        >
          Reset App
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
