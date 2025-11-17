import { json } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { loadHistory } from '../../../server/scheduler/storage'

export const APIRoute = createAPIFileRoute('/api/scheduler/history')({
  GET: async ({ request }) => {
    try {
      const history = await loadHistory()

      return json({
        history,
        count: history.length,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('[API] Error loading history:', error)
      return json(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }
  },
})
