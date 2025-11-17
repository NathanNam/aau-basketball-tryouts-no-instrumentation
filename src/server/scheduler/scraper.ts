import axios from 'axios'
import * as cheerio from 'cheerio'
import type { OrganizationConfig } from './config'

export interface ScraperResult {
  organizationName: string
  website: string
  contentHash: string
  foundPatterns: string[]
  lastChecked: string
  hasChanges: boolean
  error?: string
}

/**
 * Scrape a team website and check for changes
 */
export async function scrapeWebsite(
  org: OrganizationConfig
): Promise<ScraperResult> {
  const url = org.tryoutPage || org.website

  try {
    // Fetch the website
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; AAU-Tryouts-Checker/1.0; +https://github.com/nathannam/aau-basketball-tryouts)',
      },
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Extract relevant text content
    const bodyText = $('body').text().toLowerCase()

    // Check for patterns
    const foundPatterns = org.checkPatterns.filter((pattern) =>
      bodyText.includes(pattern.toLowerCase())
    )

    // Create a simple content hash (you can improve this with crypto.createHash)
    const contentHash = createSimpleHash(bodyText)

    return {
      organizationName: org.name,
      website: url,
      contentHash,
      foundPatterns,
      lastChecked: new Date().toISOString(),
      hasChanges: false, // Will be determined by comparing with previous hash
    }
  } catch (error) {
    console.error(`Error scraping ${org.name}:`, error)
    return {
      organizationName: org.name,
      website: url,
      contentHash: '',
      foundPatterns: [],
      lastChecked: new Date().toISOString(),
      hasChanges: false,
      error:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Scrape all configured websites
 */
export async function scrapeAllWebsites(
  organizations: OrganizationConfig[]
): Promise<ScraperResult[]> {
  console.log(
    `[Scraper] Starting scrape of ${organizations.length} organizations...`
  )

  const results = await Promise.allSettled(
    organizations.map((org) => scrapeWebsite(org))
  )

  const scraperResults: ScraperResult[] = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      // Handle rejected promise
      return {
        organizationName: organizations[index].name,
        website: organizations[index].website,
        contentHash: '',
        foundPatterns: [],
        lastChecked: new Date().toISOString(),
        hasChanges: false,
        error: result.reason?.message || 'Failed to scrape website',
      }
    }
  })

  console.log(`[Scraper] Completed scraping ${scraperResults.length} websites`)
  return scraperResults
}

/**
 * Simple hash function for content comparison
 * In production, use crypto.createHash('sha256')
 */
function createSimpleHash(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

/**
 * Compare current results with previous results to detect changes
 */
export function detectChanges(
  currentResults: ScraperResult[],
  previousResults: ScraperResult[]
): ScraperResult[] {
  return currentResults.map((current) => {
    const previous = previousResults.find(
      (p) => p.organizationName === current.organizationName
    )

    if (!previous) {
      // New organization, consider it a change
      return { ...current, hasChanges: true }
    }

    // Check if content hash has changed
    const hasChanges = previous.contentHash !== current.contentHash

    return { ...current, hasChanges }
  })
}
