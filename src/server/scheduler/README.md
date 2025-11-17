# AAU Tryouts Scheduler

Automated system for checking AAU team websites for tryout schedule updates.

## Overview

The scheduler automatically checks all configured AAU team websites daily to detect changes in tryout information. It helps keep the tryouts database up-to-date by alerting when organizations post new tryout schedules.

## Features

- **Daily Automated Checks**: Runs every day at 9:00 AM Pacific Time
- **Change Detection**: Compares current content with previous scrapes
- **Pattern Matching**: Searches for relevant keywords (tryout, registration, age groups, dates)
- **History Tracking**: Maintains 30 days of check history
- **Manual Triggering**: API endpoints to run checks on-demand
- **Dashboard**: Web interface to view status and results

## How It Works

1. **Scheduled Execution**: Node-cron triggers the job daily at 9 AM PT
2. **Website Scraping**: Axios + Cheerio fetch and parse each organization's website
3. **Pattern Detection**: Searches page content for configured keywords
4. **Change Detection**: Compares content hash with previous check
5. **Storage**: Saves results to `.scraper-data/` directory
6. **Logging**: Console logs all changes detected

## Configuration

Edit [`config.ts`](./config.ts) to modify:

- **Schedule**: Change cron pattern (default: `'0 9 * * *'` = 9 AM daily)
- **Timezone**: Change from `'America/Los_Angeles'`
- **Organizations**: Add/remove teams to monitor
- **Check Patterns**: Customize keywords to search for

Example configuration:

```typescript
export const schedulerConfig = {
  schedule: '0 9 * * *',  // Daily at 9 AM
  enabled: process.env.NODE_ENV === 'production',
  timezone: 'America/Los_Angeles',
  organizations: [
    {
      name: 'Bay Area Wildcats Basketball',
      website: 'https://bayareawildcats.org',
      checkPatterns: ['tryout', 'registration', 'schedule'],
    },
    // ... more organizations
  ],
}
```

## API Endpoints

### GET /api/scheduler/status
Get current scheduler status and recent changes summary.

**Response:**
```json
{
  "scheduler": {
    "enabled": true,
    "running": true,
    "schedule": "0 9 * * *",
    "nextRun": "2025-11-18T17:00:00.000Z"
  },
  "summary": {
    "totalChecks": 15,
    "recentChanges": [...],
    "lastCheck": "2025-11-17T17:00:00.000Z"
  }
}
```

### GET /api/scheduler/check
Manually trigger a scrape job.

**Response:**
```json
{
  "success": true,
  "message": "Scraped 8 websites. 2 changes detected.",
  "changesCount": 2,
  "timestamp": "2025-11-17T18:30:00.000Z"
}
```

### GET /api/scheduler/history
View complete check history (last 30 days).

**Response:**
```json
{
  "history": [...],
  "count": 15,
  "timestamp": "2025-11-17T18:30:00.000Z"
}
```

## Dashboard

Visit `/scheduler` to view the web dashboard:

- View scheduler status (enabled, running, next run time)
- See summary statistics (total checks, last check, recent changes)
- Manually trigger checks
- View detailed list of recent changes

## Storage

Data is stored in `.scraper-data/` directory:

- `latest-results.json` - Most recent scrape results
- `history.json` - Last 30 days of check history

## Environment Variables

- `NODE_ENV` - Set to `production` to enable scheduler
  - In development, scheduler is disabled to avoid unnecessary API calls
  - Use manual API trigger for testing

## Development

### Testing Locally

The scheduler is disabled in development mode. To test:

```bash
# Method 1: Use API endpoint
curl http://localhost:3001/api/scheduler/check

# Method 2: Set NODE_ENV temporarily
NODE_ENV=production pnpm dev
```

### Adding New Organizations

1. Add to `organizations` array in [`config.ts`](./config.ts)
2. Include `name`, `website`, and `checkPatterns`
3. Optionally add `tryoutPage` for specific tryout pages

Example:
```typescript
{
  name: 'New Team AAU',
  website: 'https://newteam.com',
  tryoutPage: 'https://newteam.com/tryouts',  // optional
  checkPatterns: ['tryout', '15U', '16U', '2025'],
}
```

## Production Deployment

The scheduler automatically starts when the app starts in production:

1. Set `NODE_ENV=production`
2. Start the app: `pnpm start` or `pm2 start .output/server/index.mjs`
3. Scheduler will initialize and run first check immediately
4. Subsequent checks run daily at 9 AM PT

## Monitoring

Check logs for scheduler activity:

```bash
# When deployed with PM2
pm2 logs

# Look for these log messages:
[Scheduler] ✅ Scheduler started with schedule: 0 9 * * *
[Scheduler] Starting scheduled scrape job...
[Scheduler] 🚨 Detected 2 changes:
  - Team Arsenal AAU
```

## Extending

### Add Email Notifications

Install nodemailer:
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

In [`index.ts`](./index.ts), add after detecting changes:
```typescript
if (changesCount > 0) {
  await sendEmailNotification(resultsWithChanges.filter(r => r.hasChanges))
}
```

### Add Slack Notifications

```typescript
import axios from 'axios'

async function sendSlackNotification(changes: ScraperResult[]) {
  await axios.post(process.env.SLACK_WEBHOOK_URL!, {
    text: `🏀 ${changes.length} AAU team(s) updated their website!`,
    attachments: changes.map(c => ({
      title: c.organizationName,
      text: c.website,
    })),
  })
}
```

## Troubleshooting

### Scheduler not running

1. Check `NODE_ENV` is set to `production`
2. Check logs for initialization message
3. Verify no errors in console

### No changes detected

1. Check if websites are accessible
2. Verify `checkPatterns` are accurate
3. Review scraper results in `.scraper-data/latest-results.json`

### High false positives

1. Make patterns more specific
2. Implement better content comparison (use crypto.createHash instead of simple hash)
3. Add content filtering to ignore dynamic elements (dates, counters, etc.)

## License

Part of the AAU Basketball Tryouts project.
