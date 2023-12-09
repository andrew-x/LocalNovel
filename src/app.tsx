import '@/styles/index.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import StoryPage from './pages/Story'
import store from './util/store'

function App() {
  return (
    <Provider store={store}>
      <MantineProvider
        theme={{
          fontFamily: 'Lato, sans-serif',
        }}
        defaultColorScheme="dark"
      >
        <ModalsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/story/:id" element={<StoryPage />} />
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
        <Notifications />
      </MantineProvider>
    </Provider>
  )
}

const rootElement = document.getElementById('_root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
