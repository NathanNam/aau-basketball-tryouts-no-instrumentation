import type { Tryout } from '../types/tryout'

interface TryoutCardProps {
  tryout: Tryout
  onClick?: () => void
}

export function TryoutCard({ tryout }: TryoutCardProps) {
  const tryoutDate = new Date(tryout.tryoutDate)
  const formattedDate = tryoutDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const isUpcoming = tryoutDate >= new Date()
  const registrationDeadline = tryout.registrationDeadline
    ? new Date(tryout.registrationDeadline)
    : null
  const isDeadlineSoon =
    registrationDeadline &&
    registrationDeadline <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const handleCardClick = () => {
    if (tryout.websiteUrl) {
      window.open(tryout.websiteUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {tryout.teamName}
          </h3>
          {tryout.organizationName && (
            <p className="text-sm text-gray-600">{tryout.organizationName}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 items-end ml-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              tryout.gender === 'Boys'
                ? 'bg-blue-100 text-blue-800'
                : tryout.gender === 'Girls'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-purple-100 text-purple-800'
            }`}
          >
            {tryout.gender}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
            {tryout.ageGroup}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <svg
            className="w-5 h-5 mr-2 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">{formattedDate}</span>
          {!isUpcoming && (
            <span className="ml-2 text-xs text-gray-500">(Past)</span>
          )}
        </div>

        <div className="flex items-center text-gray-700">
          <svg
            className="w-5 h-5 mr-2 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {tryout.startTime}
            {tryout.endTime && ` - ${tryout.endTime}`}
          </span>
        </div>

        <div className="flex items-center text-gray-700">
          <svg
            className="w-5 h-5 mr-2 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {tryout.venue}, {tryout.city}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tryout.scheduleStatus && (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              tryout.scheduleStatus === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : tryout.scheduleStatus === 'tentative'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {tryout.scheduleStatus === 'confirmed'
              ? '✓ Confirmed'
              : tryout.scheduleStatus === 'tentative'
                ? '⚠ Tentative'
                : 'ℹ Dates TBA'}
          </span>
        )}
        {tryout.skillLevel && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {tryout.skillLevel}
          </span>
        )}
        {tryout.cost && (
          <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded text-xs font-semibold">
            {tryout.cost}
          </span>
        )}
        {isDeadlineSoon && (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
            Registration Closing Soon
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {tryout.websiteUrl && (
          <a
            href={tryout.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors text-center text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Website
          </a>
        )}
        {tryout.registrationUrl && (
          <a
            href={tryout.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-600 transition-colors text-center text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Register
          </a>
        )}
      </div>
    </div>
  )
}
