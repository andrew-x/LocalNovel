import { useToast } from '@/hooks/useToast'
import useZodForm from '@/hooks/useZodForm'
import { CommonProps } from '@/types/common'
import { logError } from '@/util/logger'
import { trpc } from '@/util/trpc'
import { ActionIcon, Button, Menu, TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import { MoreVertical } from 'lucide-react'
import { z } from 'zod'

export default function AdminMenu({ className }: CommonProps) {
  const { success, error } = useToast()

  const utils = trpc.useUtils()
  const { data: config } = trpc.admin.getConfig.useQuery()
  const { mutate: openAppDir } = trpc.admin.openAppDir.useMutation({
    onError(err) {
      logError(err)
      error('Error opening app directory')
    },
  })
  const { mutate: resetApp } = trpc.admin.resetApp.useMutation({
    onSuccess() {
      utils.invalidate()
      success('App reset')
    },
    onError(err) {
      logError(err)
      error('Error resetting app')
    },
  })
  const { mutate: updateConfig, isLoading: isUpdatingConfig } =
    trpc.admin.updateConfig.useMutation({
      onSuccess() {
        success('Settings saved')
        utils.admin.getConfig.invalidate()
        modals.closeAll()
      },
      onError(err) {
        logError(err)
        error('Error saving settings')
      },
    })

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useZodForm({
    schema: z.object({
      url: z.string().url(),
    }),
  })
  const onSubmitSettings = handleSubmit(({ url }) => {
    updateConfig({ url })
  })

  function onShowSettings() {
    reset()
    modals.open({
      title: 'Settings',
      children: (
        <form className="flex flex-col gap-y-6" onSubmit={onSubmitSettings}>
          <TextInput
            label="API URL"
            description="The URL of the AI service that will fascillitate generations"
            error={errors.url?.message}
            defaultValue={config?.url || ''}
            {...register('url')}
          />
          <Button className="mx-auto" type="submit" loading={isUpdatingConfig}>
            Save
          </Button>
        </form>
      ),
    })
  }

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" className={className}>
          <MoreVertical color="gray" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => onShowSettings()}>Settings</Menu.Item>
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
