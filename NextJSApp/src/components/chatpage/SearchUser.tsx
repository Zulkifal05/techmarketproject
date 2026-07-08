"use client"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

type SearchUserResult = {
  _id: string
  name: string
  email: string
  profilePicture?: string
  role?: string
}

const SearchUser = ({ onSelect }: { onSelect?: (user: SearchUserResult) => void }) => {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchUserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const debounceRef = useRef<number | null>(null)

  const trimmedQuery = useMemo(() => query.trim(), [query])

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setTouched(false)
    setError(null)
  }

  const handleSelect = (user: SearchUserResult) => {
    clearSearch()
    if (onSelect) {
      onSelect(user)
      return
    }
    router.push(`/Chat/${user._id}`)
  }

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    if (!trimmedQuery) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    debounceRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/User/Search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          const body = await response.json().catch(() => null)
          const message = body?.error || "Unable to search users"
          throw new Error(message)
        }

        const data = await response.json()
        setResults(data.users || [])
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return
        }
        setError(fetchError instanceof Error ? fetchError.message : "Search failed")
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
      controller.abort()
    }
  }, [trimmedQuery])

  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Search users</h2>
          <p className="text-sm text-gray-500">Search by name or email to start a new conversation.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="relative block">
          <span className="sr-only">Search users</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setTouched(true)
              setQuery(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && results.length > 0) {
                event.preventDefault()
                handleSelect(results[0])
              }
            }}
            placeholder="Search users by name or email"
            className="w-full rounded-3xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {loading && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
            Searching users...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && trimmedQuery && results.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            {`No users found for “${trimmedQuery}”.`}
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-3">
            {results.map((user) => (
              <button
                type="button"
                key={user._id}
                onClick={() => handleSelect(user)}
                className="w-full text-left cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-sm font-semibold text-slate-700 overflow-hidden">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((segment) => segment[0]?.toUpperCase())
                          .join("")
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {user.role || "User"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!trimmedQuery && touched && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Start typing to search users by name or email.
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchUser