import fs from 'fs/promises'
import path from 'path'
import type { ScraperResult } from './scraper'

const STORAGE_DIR = path.join(process.cwd(), '.scraper-data')
const RESULTS_FILE = path.join(STORAGE_DIR, 'latest-results.json')
const HISTORY_FILE = path.join(STORAGE_DIR, 'history.json')

export interface ScraperHistory {
  timestamp: string
  results: ScraperResult[]
  changesDetected: number
}

/**
 * Initialize storage directory
 */
export async function initializeStorage(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true })
    console.log(`[Storage] Initialized storage directory: ${STORAGE_DIR}`)
  } catch (error) {
    console.error('[Storage] Failed to initialize storage:', error)
  }
}

/**
 * Save scraper results
 */
export async function saveResults(results: ScraperResult[]): Promise<void> {
  try {
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2))
    console.log(`[Storage] Saved ${results.length} results to ${RESULTS_FILE}`)
  } catch (error) {
    console.error('[Storage] Failed to save results:', error)
  }
}

/**
 * Load previous scraper results
 */
export async function loadPreviousResults(): Promise<ScraperResult[]> {
  try {
    const data = await fs.readFile(RESULTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return []
  }
}

/**
 * Append to history log
 */
export async function appendToHistory(
  results: ScraperResult[]
): Promise<void> {
  try {
    const changesDetected = results.filter((r) => r.hasChanges).length

    const historyEntry: ScraperHistory = {
      timestamp: new Date().toISOString(),
      results,
      changesDetected,
    }

    let history: ScraperHistory[] = []

    try {
      const existingData = await fs.readFile(HISTORY_FILE, 'utf-8')
      history = JSON.parse(existingData)
    } catch {
      // File doesn't exist yet
    }

    history.push(historyEntry)

    // Keep only last 30 days of history
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    history = history.filter(
      (entry) => new Date(entry.timestamp) > thirtyDaysAgo
    )

    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))
    console.log(`[Storage] Appended to history. Total entries: ${history.length}`)
  } catch (error) {
    console.error('[Storage] Failed to append to history:', error)
  }
}

/**
 * Load scraper history
 */
export async function loadHistory(): Promise<ScraperHistory[]> {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

/**
 * Get changes summary
 */
export async function getChangesSummary(): Promise<{
  totalChecks: number
  recentChanges: ScraperResult[]
  lastCheck: string | null
}> {
  try {
    const history = await loadHistory()
    const latest = history[history.length - 1]

    if (!latest) {
      return {
        totalChecks: 0,
        recentChanges: [],
        lastCheck: null,
      }
    }

    const recentChanges = latest.results.filter((r) => r.hasChanges)

    return {
      totalChecks: history.length,
      recentChanges,
      lastCheck: latest.timestamp,
    }
  } catch (error) {
    return {
      totalChecks: 0,
      recentChanges: [],
      lastCheck: null,
    }
  }
}
