import { useState } from 'react'
import type { AgeGroup, Gender } from '../types/tryout'

interface FilterPanelProps {
  selectedAgeGroups: AgeGroup[]
  selectedCities: string[]
  selectedGenders: Gender[]
  searchQuery: string
  onAgeGroupChange: (ageGroups: AgeGroup[]) => void
  onCityChange: (cities: string[]) => void
  onGenderChange: (genders: Gender[]) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
  availableCities: string[]
}

const AGE_GROUPS: AgeGroup[] = [
  '14U',
  '15U',
  '16U',
  '17U',
  '18U',
  'High School',
]
const GENDERS: Gender[] = ['Boys', 'Girls', 'Co-ed']

export function FilterPanel({
  selectedAgeGroups,
  selectedCities,
  selectedGenders,
  searchQuery,
  onAgeGroupChange,
  onCityChange,
  onGenderChange,
  onSearchChange,
  onClearFilters,
  availableCities,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAgeGroup = (ageGroup: AgeGroup) => {
    if (selectedAgeGroups.includes(ageGroup)) {
      onAgeGroupChange(selectedAgeGroups.filter((ag) => ag !== ageGroup))
    } else {
      onAgeGroupChange([...selectedAgeGroups, ageGroup])
    }
  }

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      onCityChange(selectedCities.filter((c) => c !== city))
    } else {
      onCityChange([...selectedCities, city])
    }
  }

  const toggleGender = (gender: Gender) => {
    if (selectedGenders.includes(gender)) {
      onGenderChange(selectedGenders.filter((g) => g !== gender))
    } else {
      onGenderChange([...selectedGenders, gender])
    }
  }

  const hasActiveFilters =
    selectedAgeGroups.length > 0 ||
    selectedCities.length > 0 ||
    selectedGenders.length > 0 ||
    searchQuery.length > 0

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">
            Filters {hasActiveFilters && '(Active)'}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter panel */}
      <div
        className={`bg-white rounded-lg shadow-md p-6 ${
          isOpen ? 'block' : 'hidden'
        } lg:block`}
      >
        {/* Search */}
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Search Teams
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by team name..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Age Group Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Age Group
          </h3>
          <div className="space-y-2">
            {AGE_GROUPS.map((ageGroup) => (
              <label
                key={ageGroup}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedAgeGroups.includes(ageGroup)}
                  onChange={() => toggleAgeGroup(ageGroup)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">{ageGroup}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Gender</h3>
          <div className="space-y-2">
            {GENDERS.map((gender) => (
              <label
                key={gender}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedGenders.includes(gender)}
                  onChange={() => toggleGender(gender)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* City Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">City</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableCities.map((city) => (
              <label
                key={city}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() => toggleCity(city)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </>
  )
}
