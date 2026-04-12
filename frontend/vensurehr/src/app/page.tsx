'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Candidate {
  id: string | number
  name: string
  current_title?: string
  interviewed_at?: string | null
  match_score?: number | null
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  reason?: string
}

interface SearchResult {
  id: string | number
  name: string
  reason: string
  score: number
}

function getMonthsAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not yet interviewed'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
  if (diffMonths < 1) return 'Less than a month ago'
  if (diffMonths === 1) return '1 month ago'
  return `${diffMonths} months ago`
}

function getHoursAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return 'unknown'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'just now'
  if (diffHours === 1) return '1h ago'
  return `${diffHours}h ago`
}

function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) {
    return (
      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
        —
      </span>
    )
  }
  let colorClass = 'bg-red-100 text-red-700'
  if (score > 80) colorClass = 'bg-green-100 text-green-700'
  else if (score >= 60) colorClass = 'bg-yellow-100 text-yellow-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {score}
    </span>
  )
}

function CandidateCard({
  candidate,
  fromSearch,
  onClick,
}: {
  candidate: Candidate
  fromSearch?: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="font-semibold text-gray-900">{candidate.name}</div>
      <div className="text-sm text-gray-500 mt-0.5">
        {candidate.current_title || 'No title'}
      </div>
      {fromSearch && candidate.reason && (
        <div className="text-xs text-gray-400 italic mt-1">{candidate.reason}</div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Interviewed {getMonthsAgo(candidate.interviewed_at)}
      </div>
      <div className="flex gap-2 mt-2">
        {candidate.linkedin_url && (
          <a
            href={candidate.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 text-xs hover:underline"
          >
            🔗 LinkedIn
          </a>
        )}
        {candidate.github_url && (
          <a
            href={candidate.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-700 text-xs hover:underline"
          >
            🔗 GitHub
          </a>
        )}
        {candidate.twitter_url && (
          <a
            href={candidate.twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sky-500 text-xs hover:underline"
          >
            🔗 X
          </a>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-xs text-gray-400">Match:</span>
        <ScoreBadge score={candidate.match_score} />
      </div>
    </div>
  )
}

function ActivityFeed({ candidates }: { candidates: Candidate[] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [candidates])

  const items = [...candidates]
    .sort((a, b) => {
      const ta = a.interviewed_at ? new Date(a.interviewed_at).getTime() : 0
      const tb = b.interviewed_at ? new Date(b.interviewed_at).getTime() : 0
      return tb - ta
    })
    .slice(0, 10)

  const dotColors = [
    'bg-green-400',
    'bg-blue-400',
    'bg-purple-400',
    'bg-orange-400',
    'bg-pink-400',
  ]

  return (
    <div className="w-72 shrink-0 bg-white border-l border-gray-200 h-full overflow-auto">
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700 text-sm">Live Activity</h2>
      </div>
      <div className="px-4 py-2 space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-gray-400 py-4">No activity yet</p>
        )}
        {items.map((c, i) => (
          <div
            key={c.id}
            className={`flex items-start gap-2 py-2 border-b border-gray-50 transition-opacity duration-500 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span
              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColors[i % dotColors.length]}`}
            />
            <div>
              <span className="text-xs font-medium text-gray-700">{c.name}</span>
              <span className="text-xs text-gray-400"> — profile updated — </span>
              <span className="text-xs text-gray-400">
                {getHoursAgo(c.interviewed_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TalentPoolPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/candidates`)
      if (!res.ok) throw new Error('Failed to fetch candidates')
      const data = await res.json()
      setCandidates(data)
    } catch (err) {
      toast.error('Failed to load candidates')
    } finally {
      setLoadingCandidates(false)
    }
  }, [])

  useEffect(() => {
    fetchCandidates()
    const interval = setInterval(fetchCandidates, 30000)
    return () => clearInterval(interval)
  }, [fetchCandidates])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchText.trim()) {
      setSearchResults(null)
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: searchText }),
      })
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setSearchText('')
  }

  // Build display list
  let displayCandidates: Candidate[] = candidates
  let fromSearch = false

  if (searchResults !== null) {
    fromSearch = true
    displayCandidates = searchResults.map((sr) => {
      const found = candidates.find((c) => String(c.id) === String(sr.id))
      return {
        ...(found || { id: sr.id, name: sr.name }),
        reason: sr.reason,
        match_score: sr.score,
      }
    })
  }

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Talent Pool</h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Ask anything — who has been building AI projects?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchResults !== null && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </form>

        {/* Results header */}
        {searchResults !== null && (
          <div className="mb-4 text-sm text-gray-500">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{searchText}&quot;
          </div>
        )}

        {/* Candidate grid */}
        {loadingCandidates ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
          </div>
        ) : displayCandidates.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {fromSearch ? 'No results found' : 'No candidates yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayCandidates.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                fromSearch={fromSearch}
                onClick={() => router.push(`/candidates/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <ActivityFeed candidates={candidates} />
    </div>
  )
}
