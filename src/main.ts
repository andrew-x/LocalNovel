import { exec } from 'child_process'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import { wipeData } from './handlers/admin.main'
import { loadContent, updateContent } from './handlers/content.main'
import {
  createStory,
  deleteStory,
  getStories,
  getStory,
  updateStory,
} from './handlers/story.main'
import { DATA_PATH, MANIFEST_PATH } from './util/constants.main'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

fs.ensureDirSync(DATA_PATH)
if (!fs.existsSync(MANIFEST_PATH)) {
  fs.writeJSONSync(MANIFEST_PATH, {
    stories: {},
    config: {
      apiURL: 'http://localhost:5000/api',
    },
  })
}

async function runMigrations() {
  return new Promise<void>((resolve, reject) => {
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error}`)
        return reject(error)
      }
      console.log(`Migration output: ${stdout}`)
      resolve()
    })
  })
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
  ipcMain.handle('open-app-folder', async () => {
    shell.openPath(app.getPath('userData'))
  })
  ipcMain.handle('get-stories', async () => {
    return getStories()
  })
  ipcMain.handle('get-story', async (_, id: string) => {
    return getStory(id)
  })
  ipcMain.handle('create-story', async (_, title: string, tags: string[]) => {
    return createStory(title, tags)
  })
  ipcMain.handle('update-story', async (_, story: any) => {
    return updateStory(story)
  })
  ipcMain.handle('delete-story', async (_, id: string) => {
    return deleteStory(id)
  })
  ipcMain.handle('load-content', async (_, id: string) => {
    return loadContent(id)
  })
  ipcMain.handle('update-content', async (_, id: string, content: string) => {
    return updateContent(id, content)
  })

  ipcMain.handle('wipe-data', async () => {
    return wipeData()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
