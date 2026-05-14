"use client"
import { Search , Menu , X , Building , MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { developmentCategories } from '@/constants/Categories'
import { User } from '@techmarket/models/dist/UserModel'

export default function Header({ user }:{ user : User }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                          <li
                            key={category}
                            className="cursor-pointer px-4 py-3 text-sm text-gray-700 hover:bg-black/5"
                          >
                            {category}
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

              <Link
                href="/Signup"
                className="hidden sm:block px-4 py-2 text-sm bg-linear-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Logout
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
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
                        <li
                          key={category}
                          className="cursor-pointer px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {category}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4">
              <Link
                href="/Signup"
                className="block w-full px-4 py-2 text-center bg-linear-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </header>
        </>
    )
}