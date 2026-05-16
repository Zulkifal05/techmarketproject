import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-3xl shadow-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-blue-700 mx-auto mb-6">
          <span className="text-3xl font-semibold">404</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile not found</h1>
        <p className="text-gray-600 mb-8">
          The profile you are looking for is unavailable. It may have been removed, the link may be incorrect, or the user no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          Return to Main Page
        </Link>
      </div>
    </div>
  );
}
