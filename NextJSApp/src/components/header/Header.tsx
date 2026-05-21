"use client"
import { Search , Building , MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { developmentCategories } from '@/constants/Categories'
import { User } from '@techmarket/models/dist/UserModel'
import ProfileAvatar from './UserProfileIcon'

type UserProps = {
  user: User & { _id?: string };
};

export default function Header({ user } : UserProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
      const normalizedQuery = searchTerm.trim().toLowerCase();
      if (!normalizedQuery) return [];
      return developmentCategories.filter((category) =>
        category.toLowerCase().includes(normalizedQuery)
      );
    }, [searchTerm]);

    const canShowSearch = user?.role === 'SELLER';

    return (
        <>
        {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechMaket
              </span>
            </div>

            {/* Search Bar - Desktop */}
            {canShowSearch && (
              <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search for projects..."
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {searchTerm.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 z-50">
                    <ul className="divide-y divide-gray-100">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.slice(0, 8).map((category) => (
                          <li key={category}>
                            <Link
                              href={`/category/${encodeURIComponent(category)}`}
                              onClick={() => setSearchTerm("")}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-black/5"
                            >
                              {category}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-sm text-gray-500">No suggestions found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link href="/Chats" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <MessageSquare className="w-6 h-6 text-gray-700" />
              </Link>

              <ProfileAvatar user={user} />
            </div>
          </div>

          {/* Mobile Search */}
          {canShowSearch && (
            <div className="md:hidden pb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {searchTerm.trim() && (
                <div className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 z-50">
                  <ul className="divide-y divide-gray-100">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.slice(0, 8).map((category) => (
                        <li key={category}>
                          <Link
                            href={`/category/${encodeURIComponent(category)}`}
                            onClick={() => setSearchTerm("")}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {category}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-500">No suggestions found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
        </>
    )
}