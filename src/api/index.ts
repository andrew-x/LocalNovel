import adminRouter from './admin'
import aiRouter from './ai'
import storyRouter from './story'
import { router } from './_trpc'

export const appRouter = router({
  admin: adminRouter,
  story: storyRouter,
  ai: aiRouter,
})

export type AppRouter = typeof appRouter
