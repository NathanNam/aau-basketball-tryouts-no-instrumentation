import { startScheduler } from './scheduler'

// Initialize server-side components
export async function initializeServer() {
  console.log('[Server] Initializing server components...')

  // Start the scheduler
  await startScheduler()

  console.log('[Server] Server initialization complete')
}

// Auto-initialize on server startup (only runs on server, not in browser)
if (typeof window === 'undefined') {
  initializeServer().catch((error) => {
    console.error('[Server] Failed to initialize server:', error)
  })
}
