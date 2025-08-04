import { Link } from 'wouter';

export function TradingDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Trading Module
        </h1>
        <p className="text-gray-600">
          EMA risk assessment and trading analytics
        </p>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">
          📈 Ready for EMA Integration
        </h2>
        <p className="text-green-800 mb-4">
          This is where your EMA Risk Assessment System will be integrated:
        </p>
        <ul className="text-green-700 space-y-2">
          <li>• <strong>Risk Calculator</strong> - Statistical edge calculation</li>
          <li>• Pattern Analysis - EMA configuration analysis</li>
          <li>• Performance Tracking - Success rate monitoring</li>
          <li>• Trading History - Assessment records</li>
          <li>• Cross-Module Insights - Psychology + Trading correlations</li>
        </ul>
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-900 font-medium">
            Next Step: Integrate EMA Risk Assessment components as trading module.
          </p>
        </div>
      </div>
    </div>
  );
}
