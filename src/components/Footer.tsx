export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-400 text-sm">
              Your centralized resource for AAU basketball tryout information in
              the San Francisco Bay Area. Find tryouts for high school-aged
              players (14U and up).
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Coverage Area</h3>
            <p className="text-gray-400 text-sm">
              San Francisco, Oakland, San Jose, East Bay, South Bay, North Bay,
              and Peninsula regions.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} AAU Basketball Tryouts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
