import { Story } from '@/types/data'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    openAppFolder: builder.mutation<void, void>({
      async queryFn() {
        await window.electronAPI.openAppFolder()
        return {
          data: undefined,
        }
      },
    }),
    getStories: builder.query<Story[], void>({
      async queryFn() {
        const stories = await window.electronAPI.getStories()
        return {
          data: stories,
        }
      },
      providesTags: ['Story'],
    }),
    getStory: builder.query({
      async queryFn(id: string) {
        const story = await window.electronAPI.getStory(id)
        return {
          data: story,
        }
      },
      providesTags: ['Story'],
    }),
    createStory: builder.mutation<Story, { title: string; tags: string[] }>({
      async queryFn({ title, tags }) {
        const story = await window.electronAPI.createStory(title, tags)
        return {
          data: story,
        }
      },
      invalidatesTags: ['Story'],
    }),
    updateStory: builder.mutation<Story, Partial<Story> & { id: string }>({
      async queryFn(story) {
        const next = await window.electronAPI.updateStory(story)
        return {
          data: next,
        }
      },
      invalidatesTags: ['Story'],
    }),
    deleteStory: builder.mutation<void, string>({
      async queryFn(id) {
        await window.electronAPI.deleteStory(id)
        return {
          data: undefined,
        }
      },
      invalidatesTags: ['Story'],
    }),

    loadContent: builder.query<string, string>({
      async queryFn(id: string) {
        const content = await window.electronAPI.loadContent(id)
        return {
          data: content,
        }
      },
      providesTags: (_result, _err, id) => [{ type: 'Content', id }],
    }),
    updateContent: builder.mutation<void, { id: string; content: string }>({
      async queryFn({ id, content }) {
        await window.electronAPI.updateContent(id, content)
        return {
          data: undefined,
        }
      },
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Content', id }],
    }),

    generate: builder.query<
      string,
      {
        content: string
        instructions: string
      }
    >({
      async queryFn({ content, instructions }) {
        return {
          data: '',
        }
      },
    }),

    wipeData: builder.mutation<void, void>({
      async queryFn() {
        await window.electronAPI.wipeData()
        return {
          data: undefined,
        }
      },
      invalidatesTags: ['Story', 'Content'],
    }),
  }),
  tagTypes: ['Story', 'Content'],
})

export default mainApi
