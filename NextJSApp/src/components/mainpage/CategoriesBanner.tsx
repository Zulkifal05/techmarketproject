import Link from "next/link"

const trendingCategories = [
    { name: 'Frontend', icon: 'FD', color: 'bg-blue-100 text-blue-600', link: "/category/frontend-development" },
    { name: 'Backend', icon: 'BD', color: 'bg-green-100 text-green-600', link: "/category/backend-development" },
    { name: 'Full-Stack', icon: 'FS', color: 'bg-yellow-100 text-yellow-600', link: "/category/full-stack-development" },
    { name: 'Mobile', icon: 'MD', color: 'bg-blue-100 text-blue-600', link: "/category/mobile-app-development" },
    { name: 'Database', icon: 'DB', color: 'bg-green-100 text-green-600', link: "/category/database-architecture" },
    { name: 'Cloud', icon: 'CD', color: 'bg-yellow-100 text-yellow-600', link: "/category/cloud-deployment" },
]

export default function CategoriesBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.link}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl hover:shadow-lg transition border border-gray-200 hover:border-blue-300"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                    {Icon}
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{category.name}</span>
              </Link>
            );
          })}
        </div>
    </div>
  )
}