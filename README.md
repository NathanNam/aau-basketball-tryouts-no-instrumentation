# AAU Basketball Tryouts - SF Bay Area

A web application to help high school basketball players (14U+) find and track AAU basketball tryouts in the San Francisco Bay Area.

Built with [TanStack Start](https://tanstack.com/router) (React Router).

## Features

- **Comprehensive Tryout Database**: 19 teams from 8 AAU organizations across the Bay Area
- **Advanced Filtering**: Filter by age group (14U-18U, High School), gender (Boys, Girls, Co-ed), and city
- **Search Functionality**: Quick search by team name or organization
- **Schedule Status Indicators**: Visual badges showing schedule reliability:
  - ✓ **Confirmed** (Green): Exact dates, times, and locations officially announced
  - ⚠ **Tentative** (Yellow): Approximate dates known, but details may change
  - ℹ **Dates TBA** (Blue): Programs exist but specific tryout dates not yet announced
- **Automated Monitoring**: Daily web scraping checks for schedule updates
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Direct Links**: Quick access to team websites and registration forms

## Coverage

- **Organizations**: 8 AAU basketball programs
- **Teams**: 19 teams across different age groups
- **Cities**: Oakland, San Francisco, San Mateo, Dublin, Newark
- **Age Groups**: 14U, 15U, 16U, 17U, 18U, High School
- **Gender**: Boys, Girls, and Co-ed teams

## Development

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Getting Started

From your terminal:

```sh
pnpm install
pnpm dev
```

This starts your app in development mode at `http://localhost:3001`, rebuilding assets on file changes.

### Building for Production

```sh
pnpm build
```

### Starting Production Server

```sh
pnpm start
```

## Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── TryoutCard.tsx  # Individual tryout display
│   │   ├── FilterPanel.tsx # Filtering UI
│   │   └── ...
│   ├── data/
│   │   └── tryouts.json    # Tryout database
│   ├── routes/             # TanStack Router routes
│   │   ├── index.tsx       # Home page
│   │   ├── scheduler.tsx   # Scheduler dashboard
│   │   └── api/            # API endpoints
│   ├── server/
│   │   └── scheduler/      # Automated scraping system
│   ├── types/
│   │   └── tryout.ts       # TypeScript type definitions
│   └── utils/              # Utility functions
├── aau-basketball-teams.md # Team documentation
└── public/                 # Static assets
```

## Data Management

### Tryout Data Structure

Each tryout entry in `src/data/tryouts.json` includes:

- Basic Info: Team name, organization, age group, gender
- Schedule: Tryout date(s), start/end times
- Location: Venue, address, city, zip code
- Contact: Email, phone, website, registration URL
- Details: Cost, skill level, notes
- **Schedule Status**: `confirmed`, `tentative`, or `tba`

### Adding New Teams

1. Verify the organization serves 14U+ age groups
2. Add team information to `src/data/tryouts.json`
3. Update `aau-basketball-teams.md` with organization details
4. Set appropriate `scheduleStatus` based on information reliability

### Schedule Status Guidelines

- **confirmed**: Exact dates, times, and locations have been officially announced
- **tentative**: Approximate dates are known, but specific details may change
- **tba**: Organization has programs but hasn't announced specific tryout dates yet

## Automated Scheduler

The application includes an automated web scraping system that:

- Checks organization websites daily for schedule updates
- Tracks changes to tryout information
- Maintains a history of updates
- Provides a dashboard at `/scheduler` for monitoring

Access the scheduler dashboard at `http://localhost:3001/scheduler` during development.

## Tech Stack

- **Framework**: TanStack Start (React Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **Web Scraping**: Cheerio
- **Scheduling**: node-cron
- **HTTP Client**: Axios
- **Validation**: Zod

## Contributing

Contributions are welcome! To add teams or update information:

1. Verify information from official sources
2. Update both `src/data/tryouts.json` and `aau-basketball-teams.md`
3. Follow existing data structure and format
4. Ensure schedule status is accurate

## License

MIT

## Deployment

This app can be deployed to platforms supporting Node.js:

- Netlify
- Vercel
- Railway
- Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
