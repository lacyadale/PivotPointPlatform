import { Link } from 'wouter';

export function PsychologyDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Psychology Module
        </h1>
        <p className="text-gray-600">
          School psychology assessments and evaluations
        </p>
      </div>

      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-purple-900 mb-4">
          🏗️ Ready for Migration
        </h2>
        <p className="text-purple-800 mb-4">
          This is where your existing psychology app will be integrated, including:
        </p>
        <ul className="text-purple-700 space-y-2">
          <li>• <strong>Report Writer</strong> (Star Feature) - Complete preservation</li>
          <li>• Daily Hub - Central information routing</li>
          <li>• Evaluations - New, List, Detail views</li>
          <li>• Business Management - Client and workflow management</li>
          <li>• Communications - Video calling and messaging</li>
          <li>• Billing - Financial management</li>
          <li>• Professional Development - Training tracking</li>
        </ul>
        <div className="mt-4 p-4 bg-purple-100 rounded-lg">
          <p className="text-purple-900 font-medium">
            Next Step: Begin psychology module file migration with zero changes to existing functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
