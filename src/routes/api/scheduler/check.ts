import { json } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { executeScrapeJob } from '../../../server/scheduler'

export const APIRoute = createAPIFileRoute('/api/scheduler/check')({
  GET: async ({ request }) => {
    try {
      console.log('[API] Manual scrape job triggered')
      const result = await executeScrapeJob()

      return json(
        {
          success: result.success,
          message: result.message,
          changesCount: result.changesCount,
          timestamp: new Date().toISOString(),
        },
        {
          status: result.success ? 200 : 500,
        }
      )
    } catch (error) {
      console.error('[API] Error triggering scrape job:', error)
      return json(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          changesCount: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }
  },
})
