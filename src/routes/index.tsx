import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { FilterPanel } from '../components/FilterPanel'
import { TryoutCard } from '../components/TryoutCard'
import type { Tryout, AgeGroup, Gender } from '../types/tryout'
import tryoutsData from '../data/tryouts.json'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'city' | 'ageGroup'>('date')

  const tryouts = tryoutsData as Tryout[]

  // Get unique cities from tryouts
  const availableCities = useMemo(() => {
    const cities = new Set(tryouts.map((t) => t.city))
    return Array.from(cities).sort()
  }, [tryouts])

  // Filter and sort tryouts
  const filteredTryouts = useMemo(() => {
    let filtered = [...tryouts]

    // Apply age group filter
    if (selectedAgeGroups.length > 0) {
      filtered = filtered.filter((t) => selectedAgeGroups.includes(t.ageGroup))
    }

    // Apply city filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter((t) => selectedCities.includes(t.city))
    }

    // Apply gender filter
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((t) => selectedGenders.includes(t.gender))
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.teamName.toLowerCase().includes(query) ||
          t.organizationName?.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'date':
        filtered.sort(
          (a, b) =>
            new Date(a.tryoutDate).getTime() -
            new Date(b.tryoutDate).getTime()
        )
        break
      case 'city':
        filtered.sort((a, b) => a.city.localeCompare(b.city))
        break
      case 'ageGroup':
        filtered.sort((a, b) => a.ageGroup.localeCompare(b.ageGroup))
        break
    }

    return filtered
  }, [
    tryouts,
    selectedAgeGroups,
    selectedCities,
    selectedGenders,
    searchQuery,
    sortBy,
  ])

  const clearFilters = () => {
    setSelectedAgeGroups([])
    setSelectedCities([])
    setSelectedGenders([])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <FilterPanel
              selectedAgeGroups={selectedAgeGroups}
              selectedCities={selectedCities}
              selectedGenders={selectedGenders}
              searchQuery={searchQuery}
              onAgeGroupChange={setSelectedAgeGroups}
              onCityChange={setSelectedCities}
              onGenderChange={setSelectedGenders}
              onSearchChange={setSearchQuery}
              onClearFilters={clearFilters}
              availableCities={availableCities}
            />
          </aside>

          {/* Tryouts Grid */}
          <div className="lg:col-span-3">
            {/* Sort and count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredTryouts.length}{' '}
                {filteredTryouts.length === 1 ? 'Tryout' : 'Tryouts'} Found
              </h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'date' | 'city' | 'ageGroup')
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="city">City</option>
                  <option value="ageGroup">Age Group</option>
                </select>
              </div>
            </div>

            {/* Tryout cards */}
            {filteredTryouts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tryouts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredTryouts.map((tryout) => (
                  <TryoutCard key={tryout.id} tryout={tryout} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
