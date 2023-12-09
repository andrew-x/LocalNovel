// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from 'electron'
import { Story } from './types/data'

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronAPI', {
  openAppFolder: () => ipcRenderer.invoke('open-app-folder'),

  getStories: () => ipcRenderer.invoke('get-stories'),
  getStory: (id: string) => ipcRenderer.invoke('get-story', id),
  createStory: (title: string, tags: string[]) =>
    ipcRenderer.invoke('create-story', title, tags),
  updateStory: (story: Partial<Story> & { id: string }) =>
    ipcRenderer.invoke('update-story', story),
  deleteStory: (id: string) => ipcRenderer.invoke('delete-story', id),

  loadContent: (id: string) => ipcRenderer.invoke('load-content', id),
  updateContent: (id: string, content: string) =>
    ipcRenderer.invoke('update-content', id, content),

  wipeData: () => ipcRenderer.invoke('wipe-data'),
})
