import { Story } from '@/types/data'

export {}

interface ElectronAPI {
  getStories: () => Promise<Story[]>
  getStory: (id: string) => Promise<Story>
  createStory: (title: string, tags: string[]) => Promise<Story>
  updateStory: (story: Partial<Story> & { id: string }) => Promise<Story>
  deleteStory: (id: string) => Promise<void>
  [key: string]: (...args: any[]) => Promise<any>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
