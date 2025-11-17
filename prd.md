# Product Requirements Document: AAU Basketball Tryout Schedules

## 1. Executive Summary

### 1.1 Product Overview
A web application that aggregates and displays AAU basketball tryout schedules for high school-aged players (14U+/9th grade and higher) in the San Francisco Bay Area. The application will be built using Tanstack Start and deployed on an AWS EC2 Linux instance.

### 1.2 Target Audience
- Primary: Parents and players (ages 14+) seeking AAU basketball tryout information
- Secondary: Coaches and team administrators who may use the platform to verify their listings

### 1.3 Success Metrics
- Number of unique visitors per month
- Number of teams/tryouts listed
- User engagement (time on site, pages viewed)
- Data freshness (% of tryouts with current information)

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. Provide a centralized, easy-to-navigate resource for AAU tryout information in the SF Bay Area
2. Reduce friction in discovering tryout opportunities for high school-aged players
3. Enable filtering and searching by age group, location, and date

### 2.2 Non-Goals (Out of Scope for V1)
- Registration or payment processing for tryouts
- Team management features
- Live scoring or tournament brackets
- Mobile native applications (web-responsive only)
- User accounts or authentication
- Social features (comments, ratings, reviews)

---

## 3. User Stories & Use Cases

### 3.1 Core User Stories

**As a parent/player**, I want to:
- View all upcoming tryouts for my age group so I can plan which ones to attend
- Filter tryouts by date range so I can see what's available this month
- Filter by age group (14U, 15U, 16U, 17U, 18U/high school) so I see only relevant opportunities
- Filter by location/city within the Bay Area so I can find convenient options
- See key details (date, time, location, contact info) at a glance
- Access the team's website or contact information to get more details

**As a coach/team admin**, I want to:
- See my team's tryout information displayed accurately
- (Future: Submit or update tryout information)

### 3.2 User Journey
1. User lands on homepage
2. User sees upcoming tryouts with default filters applied (high school age groups, next 3 months)
3. User applies filters (age group, city, date range)
4. User views tryout cards with essential information
5. User clicks through to team website or contact information for registration

---

## 4. Functional Requirements

### 4.1 Data Model

#### Tryout Object
```typescript
interface Tryout {
  id: string;
  teamName: string;
  organizationName?: string; // Parent org if different from team
  ageGroup: '14U' | '15U' | '16U' | '17U' | '18U' | 'High School';
  gradeLevel?: string; // e.g., "9th-12th", "Freshmen-Seniors"
  gender: 'Boys' | 'Girls' | 'Co-ed';
  
  // Date & Time
  tryoutDate: Date;
  tryoutEndDate?: Date; // For multi-day tryouts
  startTime: string; // e.g., "6:00 PM"
  endTime?: string;
  
  // Location
  venue: string;
  address: string;
  city: string;
  zipCode?: string;
  
  // Contact & Registration
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  registrationUrl?: string;
  registrationDeadline?: Date;
  
  // Additional Info
  cost?: string; // e.g., "$50", "Free"
  notes?: string;
  skillLevel?: string; // e.g., "Competitive", "All Levels"
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  source?: string; // Where data came from
}
```

### 4.2 Core Features

#### 4.2.1 Tryout Listing View
- Display tryouts in card format (grid or list view)
- Show essential information: team name, date, time, location, age group
- Sort options:
  - By date (ascending - default)
  - By city (alphabetical)
  - By age group
- Pagination or infinite scroll (load 20 tryouts at a time)

#### 4.2.2 Filtering System
- **Age Group Filter**: Multi-select checkboxes for 14U, 15U, 16U, 17U, 18U, High School
- **Date Range Filter**: 
  - Preset options: "Next Week", "Next Month", "Next 3 Months"
  - Custom date range picker
- **Location Filter**: Multi-select cities/regions in SF Bay Area
  - San Francisco
  - Oakland
  - San Jose
  - East Bay
  - South Bay
  - North Bay
  - Peninsula
- **Gender Filter**: Boys, Girls, Co-ed
- Clear all filters button
- Active filter tags/chips showing current selections

#### 4.2.3 Search Functionality
- Text search across team names and organizations
- Real-time filtering as user types
- Clear search button

#### 4.2.4 Tryout Detail Modal/Page
- Expandable card or modal with full tryout details
- Google Maps embed or link for venue location
- All contact information and registration links
- "Add to Calendar" functionality (ICS file download)

### 4.3 Data Management

#### 4.3.1 Initial Data Source (V1)
- Manual data entry via JSON/CSV file
- Data stored in local JSON file or lightweight database (SQLite)
- Initial seed data from public sources:
  - Team websites
  - Social media announcements
  - AAU district schedules
  - Community bulletin boards

#### 4.3.2 Data Update Process (V1)
- Manual updates through file editing
- (Future: Admin interface for CRUD operations)

#### 4.3.3 Data Validation
- Required fields validation
- Date format validation
- URL format validation
- Email format validation

---

## 5. Technical Requirements

### 5.1 Technology Stack

#### Frontend Framework
- **Tanstack Start** (React-based meta-framework)
  - File-based routing
  - Server-side rendering (SSR)
  - API routes for data fetching

#### Additional Libraries
- **Styling**: TailwindCSS for responsive design
- **UI Components**: shadcn/ui or Radix UI for accessible components
- **Date Handling**: date-fns or Day.js
- **State Management**: Tanstack Query for server state
- **Form Handling**: React Hook Form (if admin features added later)
- **Icons**: Lucide React or Heroicons

#### Backend/Data
- **Database**: SQLite (for V1 simplicity) or PostgreSQL (for production scale)
- **ORM**: Drizzle ORM or Prisma
- **API**: Tanstack Start API routes

### 5.2 Deployment Architecture

#### EC2 Configuration
- **Instance Type**: t3.small or t3.medium (can start with t3.micro)
- **OS**: Amazon Linux 2023 or Ubuntu 22.04 LTS
- **Node.js**: v20.x LTS
- **Process Manager**: PM2 for Node.js application management
- **Reverse Proxy**: Nginx
  - SSL/TLS termination
  - Static file serving
  - Request forwarding to Node.js app

#### Security
- Security group configuration:
  - Port 80 (HTTP) → 443 redirect
  - Port 443 (HTTPS)
  - Port 22 (SSH) - restricted to specific IPs
- SSL certificate via Let's Encrypt (Certbot)
- Regular security updates via unattended-upgrades

#### Monitoring & Logging
- CloudWatch for basic metrics
- PM2 logs for application logging
- Nginx access/error logs

### 5.3 Performance Requirements
- Initial page load: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse Performance Score: > 90
- Mobile responsive (viewport sizes: 375px - 1920px)

### 5.4 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android)

---

## 6. Design Requirements

### 6.1 Design Principles
- Clean, minimal interface
- Mobile-first responsive design
- High readability and accessibility (WCAG 2.1 AA)
- Fast loading times
- Intuitive navigation

### 6.2 Key UI Components

#### Homepage/Main View
- Header with app title and tagline
- Filter sidebar (desktop) or collapsible filters (mobile)
- Search bar
- Tryout cards grid/list
- Footer with contact/about information

#### Tryout Card
- Team logo or placeholder
- Team name (prominent)
- Age group badge
- Date and time (emphasized)
- Location (city + venue)
- Quick action buttons (View Details, Visit Website)

#### Color Scheme
- Primary: Basketball orange (#FF6B35) or court blue
- Secondary: Neutral grays for backgrounds
- Accent: Green for CTAs
- Use semantic colors for status (upcoming, past, registration closing soon)

### 6.3 Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast ratios (4.5:1 for text)
- Focus indicators on interactive elements

---

## 7. Data Requirements

### 7.1 Initial Dataset
- Minimum 20-30 tryouts to launch
- Coverage across different:
  - Age groups (14U through 18U)
  - Cities (at least 5 different Bay Area cities)
  - Dates (next 2-3 months)

### 7.2 Data Sources (Research Phase)
- AAU District websites
- TeamSnap or LeagueApps public calendars
- Social media (Twitter, Facebook, Instagram team pages)
- Local basketball gyms and community centers
- High school basketball association websites

### 7.3 Data Freshness
- Update weekly (minimum)
- Remove past tryouts automatically
- Flag tryouts with registration deadlines approaching

---

## 8. Development Phases

### Phase 1: MVP (Weeks 1-2)
**Goal**: Basic functional app with static data

- [ ] Project setup with Tanstack Start
- [ ] Basic UI layout (header, footer, main content area)
- [ ] Tryout card component
- [ ] Static JSON data file with 20+ tryouts
- [ ] Display tryouts in grid/list view
- [ ] Basic filtering (age group, city)
- [ ] Sort by date
- [ ] Responsive design (mobile + desktop)
- [ ] Deployment to EC2 with Nginx + PM2
- [ ] SSL certificate setup

### Phase 2: Enhanced Features (Weeks 3-4)
**Goal**: Improved UX and functionality

- [ ] Advanced filtering (date range, gender)
- [ ] Search functionality
- [ ] Tryout detail modal/page
- [ ] Add to calendar functionality
- [ ] Google Maps integration
- [ ] Filter persistence (URL params)
- [ ] Loading states and error handling
- [ ] SEO optimization (meta tags, Open Graph)

### Phase 3: Data Management (Week 5+)
**Goal**: Easier data updates and scaling

- [ ] Database integration (SQLite → PostgreSQL)
- [ ] API routes for CRUD operations
- [ ] Simple admin interface (password-protected)
- [ ] Data import from CSV
- [ ] Automated cleanup of past tryouts

### Phase 4: Polish & Growth (Ongoing)
- [ ] Analytics integration (Google Analytics or Plausible)
- [ ] Social sharing functionality
- [ ] Email notifications for new tryouts (optional)
- [ ] Team submission form
- [ ] Advanced caching strategies
- [ ] CDN setup for static assets

---

## 9. Success Criteria

### Launch Criteria (MVP)
- [ ] 25+ tryouts listed across different age groups and cities
- [ ] All core features functional (filter, sort, view details)
- [ ] Mobile responsive on iPhone and Android devices
- [ ] Page load time < 3 seconds on 4G connection
- [ ] No critical accessibility issues
- [ ] SSL certificate active
- [ ] Application running stably on EC2 for 48 hours

### 30-Day Post-Launch
- 500+ unique visitors
- 50+ tryouts listed
- < 5% bounce rate on homepage
- Average session duration > 2 minutes

### 90-Day Post-Launch
- 2,000+ unique visitors
- 100+ tryouts listed
- Organic search traffic established
- At least 3 teams requesting to submit information

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Insufficient initial data | High | Medium | Research and manually compile data from 10+ sources before launch |
| Data becoming stale | High | High | Implement automated reminders, make updates easy, eventually add team submission form |
| Low user adoption | Medium | Medium | SEO optimization, social media presence, partnerships with coaches/gyms |
| EC2 costs exceed budget | Low | Low | Start with t3.micro, monitor usage, implement caching |
| Site downtime | Medium | Low | PM2 auto-restart, CloudWatch alarms, backup deployment script |

---

## 11. Open Questions

1. **Monetization**: Will this be ad-supported, freemium, or completely free?
2. **User Accounts**: Do we need user accounts for saving favorites or getting notifications?
3. **Geographic Expansion**: Plan for expanding beyond SF Bay Area?
4. **Team Verification**: How do we verify team information is accurate and legitimate?
5. **Multi-language Support**: Need Spanish language support for Bay Area communities?

---

## 12. Appendix

### 12.1 SF Bay Area Cities to Cover
- San Francisco
- Oakland
- San Jose
- Fremont
- Hayward
- Sunnyvale
- Santa Clara
- Berkeley
- Richmond
- Concord
- Walnut Creek
- Pleasanton
- Dublin
- Livermore
- Palo Alto
- Mountain View
- Redwood City
- San Mateo
- Daly City
- South San Francisco

### 12.2 Age Group Definitions
- **14U**: 14 and under (typically 8th-9th grade)
- **15U**: 15 and under (typically 9th-10th grade)
- **16U**: 16 and under (typically 10th-11th grade)
- **17U**: 17 and under (typically 11th-12th grade)
- **18U**: 18 and under (high school seniors)
- **High School**: General high school division (9th-12th grade)

### 12.3 Initial Tech Setup Commands

```bash
# On EC2 instance
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo yum install -y nginx

# Install Certbot for SSL
sudo yum install -y certbot python3-certbot-nginx
```

### 12.4 Useful Resources
- Tanstack Start Documentation: https://tanstack.com/start
- AAU Basketball Districts: https://aauboysbasketball.org
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

## Document Version Control
- **Version**: 1.0
- **Created**: November 16, 2025
- **Last Updated**: November 16, 2025
- **Author**: Product Team
- **Status**: Draft for Review