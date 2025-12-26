/**
 * Loading Component
 * Displays a loading spinner
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
