import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/scheduler')({
  component: SchedulerDashboard,
})

function SchedulerDashboard() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scheduler/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch status:', error)
      setMessage('Failed to load scheduler status')
    } finally {
      setLoading(false)
    }
  }

  const triggerCheck = async () => {
    setChecking(true)
    setMessage(null)
    try {
      const response = await fetch('/api/scheduler/check')
      const data = await response.json()
      setMessage(
        data.success
          ? `✅ ${data.message}`
          : `❌ Check failed: ${data.message}`
      )
      // Refresh status after check
      await fetchStatus()
    } catch (error) {
      console.error('Failed to trigger check:', error)
      setMessage('❌ Failed to trigger check')
    } finally {
      setChecking(false)
    }
  }

  // Load status on mount
  useState(() => {
    fetchStatus()
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Scheduler Dashboard
            </h1>
            <div className="flex gap-3">
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Status'}
              </button>
              <button
                onClick={triggerCheck}
                disabled={checking}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Run Check Now'}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded ${
                message.startsWith('✅')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {status && (
            <>
              {/* Scheduler Status */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Scheduler Status</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="text-lg font-semibold">
                      {status.scheduler.enabled ? (
                        <span className="text-green-600">✓ Enabled</span>
                      ) : (
                        <span className="text-gray-500">Disabled (Dev Mode)</span>
                      )}
                    </div>
                  </div>
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Running</div>
                    <div className="text-lg font-semibold">
                      {status.scheduler.running ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </div>
                  </div>
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Schedule</div>
                    <div className="text-lg font-semibold">
                      {status.scheduler.schedule}
                    </div>
                    <div className="text-xs text-gray-500">Daily at 9 AM PT</div>
                  </div>
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Next Run</div>
                    <div className="text-lg font-semibold">
                      {status.scheduler.nextRun || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Total Checks</div>
                    <div className="text-2xl font-bold">
                      {status.summary.totalChecks}
                    </div>
                  </div>
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Last Check</div>
                    <div className="text-sm font-semibold">
                      {status.summary.lastCheck
                        ? new Date(status.summary.lastCheck).toLocaleString()
                        : 'Never'}
                    </div>
                  </div>
                  <div className="border rounded p-4">
                    <div className="text-sm text-gray-600">Recent Changes</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {status.summary.recentChanges.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Changes */}
              {status.summary.recentChanges.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recent Changes</h2>
                  <div className="space-y-3">
                    {status.summary.recentChanges.map((change: any) => (
                      <div
                        key={change.organizationName}
                        className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded"
                      >
                        <div className="font-semibold text-gray-900">
                          {change.organizationName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {change.website}
                        </div>
                        {change.foundPatterns.length > 0 && (
                          <div className="text-xs text-gray-500 mt-2">
                            Found: {change.foundPatterns.join(', ')}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Last checked: {new Date(change.lastChecked).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!status && !loading && (
            <div className="text-center text-gray-500 py-8">
              Click "Refresh Status" to load scheduler information
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-primary hover:text-primary-600 font-medium"
          >
            ← Back to Tryouts
          </a>
        </div>
      </div>
    </div>
  )
}
