import { Link } from 'wouter';

export function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          PivotPoint Platform
        </h1>
        <p className="text-gray-600">
          Unified Psychology & Trading Assessment Platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/psychology">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Psychology Module
            </h2>
            <p className="text-gray-600 mb-4">
              School psychology assessments, evaluations, and report writing
            </p>
            <div className="flex items-center text-purple-600">
              <span className="font-medium">Access Psychology Tools</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/trading">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Trading Module
            </h2>
            <p className="text-gray-600 mb-4">
              EMA risk assessment, pattern analysis, and trading analytics
            </p>
            <div className="flex items-center text-green-600">
              <span className="font-medium">Access Trading Tools</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚀 Platform Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Structure:</span>
            <span className="text-blue-600 ml-2">✅ Complete (143 folders)</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Configuration:</span>
            <span className="text-blue-600 ml-2">✅ Ready</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Next:</span>
            <span className="text-blue-600 ml-2">🔄 Module Migration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
