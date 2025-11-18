import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getSchedulerStatus } from '../../../server/scheduler'
import { getChangesSummary } from '../../../server/scheduler/storage'

export const Route = createFileRoute('/api/scheduler/status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const status = getSchedulerStatus()
          const changesSummary = await getChangesSummary()

          return json({
            scheduler: status,
            summary: changesSummary,
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          console.error('[API] Error getting scheduler status:', error)
          return json(
            {
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString(),
            },
            { status: 500 }
          )
        }
      },
    },
  },
})
