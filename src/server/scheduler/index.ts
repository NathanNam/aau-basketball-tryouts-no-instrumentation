import cron, { type ScheduledTask } from 'node-cron'
import { schedulerConfig } from './config'
import { scrapeAllWebsites, detectChanges } from './scraper'
import {
  initializeStorage,
  saveResults,
  loadPreviousResults,
  appendToHistory,
} from './storage'

let isRunning = false
let scheduledTask: ScheduledTask | null = null

/**
 * Execute the scraping job
 */
export async function executeScrapeJob(): Promise<{
  success: boolean
  message: string
  changesCount: number
}> {
  if (isRunning) {
    console.log('[Scheduler] Job already running, skipping...')
    return {
      success: false,
      message: 'Job already running',
      changesCount: 0,
    }
  }

  isRunning = true
  console.log(
    `[Scheduler] Starting scheduled scrape job at ${new Date().toISOString()}`
  )

  try {
    // Load previous results
    const previousResults = await loadPreviousResults()
    console.log(`[Scheduler] Loaded ${previousResults.length} previous results`)

    // Scrape all websites
    const currentResults = await scrapeAllWebsites(
      schedulerConfig.organizations
    )

    // Detect changes
    const resultsWithChanges = detectChanges(currentResults, previousResults)

    // Count changes
    const changesCount = resultsWithChanges.filter((r) => r.hasChanges).length

    // Save results
    await saveResults(resultsWithChanges)

    // Append to history
    await appendToHistory(resultsWithChanges)

    // Log changes
    if (changesCount > 0) {
      console.log(`[Scheduler] 🚨 Detected ${changesCount} changes:`)
      resultsWithChanges
        .filter((r) => r.hasChanges)
        .forEach((result) => {
          console.log(`  - ${result.organizationName}`)
          console.log(`    Website: ${result.website}`)
          console.log(`    Found patterns: ${result.foundPatterns.join(', ')}`)
        })
    } else {
      console.log('[Scheduler] No changes detected')
    }

    console.log('[Scheduler] Job completed successfully')

    return {
      success: true,
      message: `Scraped ${currentResults.length} websites. ${changesCount} changes detected.`,
      changesCount,
    }
  } catch (error) {
    console.error('[Scheduler] Job failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      changesCount: 0,
    }
  } finally {
    isRunning = false
  }
}

/**
 * Start the scheduler
 */
export async function startScheduler(): Promise<void> {
  if (!schedulerConfig.enabled) {
    console.log(
      '[Scheduler] Scheduler is disabled (NODE_ENV !== production)'
    )
    return
  }

  if (scheduledTask) {
    console.log('[Scheduler] Scheduler already running')
    return
  }

  // Initialize storage
  await initializeStorage()

  // Schedule the job
  scheduledTask = cron.schedule(
    schedulerConfig.schedule,
    () => {
      executeScrapeJob()
    },
    {
      timezone: schedulerConfig.timezone,
    }
  )

  console.log(
    `[Scheduler] ✅ Scheduler started with schedule: ${schedulerConfig.schedule}`
  )
  console.log(`[Scheduler] Timezone: ${schedulerConfig.timezone}`)

  // Run once immediately on startup
  console.log('[Scheduler] Running initial scrape...')
  await executeScrapeJob()
}

/**
 * Stop the scheduler
 */
export function stopScheduler(): void {
  if (scheduledTask) {
    scheduledTask.stop()
    scheduledTask = null
    console.log('[Scheduler] Scheduler stopped')
  }
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): {
  enabled: boolean
  running: boolean
  schedule: string
} {
  return {
    enabled: schedulerConfig.enabled,
    running: scheduledTask !== null,
    schedule: schedulerConfig.schedule,
  }
}
