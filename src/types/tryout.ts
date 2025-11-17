// Type definitions for AAU Basketball Tryouts application

export type AgeGroup = '14U' | '15U' | '16U' | '17U' | '18U' | 'High School'
export type Gender = 'Boys' | 'Girls' | 'Co-ed'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
export type ScheduleStatus = 'confirmed' | 'tentative' | 'tba'

export interface Tryout {
  id: string
  teamName: string
  organizationName?: string
  ageGroup: AgeGroup
  gradeLevel?: string
  gender: Gender
  tryoutDate: string
  tryoutEndDate?: string
  startTime: string
  endTime?: string
  venue: string
  address: string
  city: string
  zipCode?: string
  contactEmail?: string
  contactPhone?: string
  websiteUrl?: string
  registrationUrl?: string
  registrationDeadline?: string
  cost?: string
  notes?: string
  skillLevel?: SkillLevel
  scheduleStatus?: ScheduleStatus
  createdAt: string
  updatedAt: string
  source?: string
}

export interface TryoutFilters {
  searchQuery: string
  ageGroups: AgeGroup[]
  genders: Gender[]
  cities: string[]
}
