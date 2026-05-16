import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-10 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 mx-auto">
          <span className="text-4xl font-bold">404</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">
          We couldn’t find the page you were looking for. Try going back to the homepage and continue exploring.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
