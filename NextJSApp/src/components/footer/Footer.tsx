import { Building } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">TechMaket</span>
              </div>
              <p className="text-sm">Your trusted marketplace for the latest tech products and innovations.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">All Products</li>
                <li className="hover:text-white cursor-pointer">Categories</li>
                <li className="hover:text-white cursor-pointer">Deals</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">Shipping</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">About</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Privacy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2026 TechMaket. All rights reserved.
          </div>
        </div>
      </footer>
    )
}