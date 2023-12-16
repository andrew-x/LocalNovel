import { initTRPC } from '@trpc/server'

const t = initTRPC.create({
  isServer: true,
})

const log = t.middleware(async ({ path, type, next, ctx, rawInput }) => {
  const start = Date.now()
  // eslint-disable-next-line no-console
  console.info(
    '=================\n',
    JSON.stringify(
      {
        key: 'REQUEST',
        type,
        path,
        context: ctx,
        input: rawInput,
      },
      null,
      2
    )
  )
  const result = await next()

  const end = Date.now()
  const duration = end - start
  const toLog: Record<string, unknown> = {
    key: result.ok ? 'COMPLETE' : 'ERROR',
    duration,
  }
  if (result.ok) {
    toLog.data = (result as { data?: unknown }).data
  } else {
    // eslint-disable-next-line no-console
    console.error(result.error)
    toLog.error = (result as { error?: { code?: string } }).error?.code
  }
  // eslint-disable-next-line no-console
  console.info(JSON.stringify(toLog, null, 2), '\n=================')
  return result
})

export const router = t.router
export const procedure = t.procedure.use(log)
