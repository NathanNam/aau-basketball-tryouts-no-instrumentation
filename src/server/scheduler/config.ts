// Scheduler configuration for checking AAU team websites

export const schedulerConfig = {
  // Cron schedule: "0 9 * * *" = Every day at 9:00 AM
  // Format: second minute hour day month weekday
  schedule: '0 9 * * *', // Daily at 9 AM

  // Enable/disable scheduler (useful for development)
  enabled: process.env.NODE_ENV === 'production',

  // Timezone
  timezone: 'America/Los_Angeles',

  // Organizations to monitor
  organizations: [
    {
      name: 'Bay Area Wildcats Basketball',
      website: 'https://bayareawildcats.org',
      checkPatterns: ['tryout', 'registration', 'schedule'],
    },
    {
      name: 'Team Arsenal AAU',
      website: 'https://teamarsenalaau.com',
      tryoutPage: 'https://teamarsenalaau.com/tryouts',
      checkPatterns: ['tryout', '14U', '15U', '16U', '17U'],
    },
    {
      name: 'Bay City Basketball',
      website: 'https://www.baycitybasketball.com',
      checkPatterns: ['tryout', 'registration', 'warriors', '3ssb'],
    },
    {
      name: 'Bay Area Mambas AAU',
      website: 'https://bayareamambas.com',
      checkPatterns: ['tryout', '14U', 'registration'],
    },
    {
      name: 'SFBA AAU',
      website: 'https://www.sfbasportsperformance.com/sfbaaaubasketballsanfrancisco',
      checkPatterns: ['tryout', '2026', 'spring', 'summer'],
    },
    {
      name: 'LAKESHOW Bay Area AAU',
      website: 'https://www.lakeshowhoops.com',
      tryoutPage: 'https://www.lakeshowhoops.com/2025-spring-tryouts',
      checkPatterns: ['tryout', 'spring', '2025', 'high school'],
    },
    {
      name: 'NorCal Rush Basketball',
      website: 'https://www.norcalrushbasketball.com',
      tryoutPage: 'https://www.norcalrushbasketball.com/tryouts',
      checkPatterns: ['tryout', 'fall', '2025', 'peninsula', 'san francisco'],
    },
    {
      name: 'Bay Area Lava',
      website: 'https://www.bayarealava.com',
      checkPatterns: ['tryout', 'december', 'high school'],
    },
  ],
}

export type OrganizationConfig = (typeof schedulerConfig.organizations)[number]
