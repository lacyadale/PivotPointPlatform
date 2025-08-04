// client/src/components/layout/UnifiedNavigation.tsx
import React, { useState } from 'react';

// Simple icon components (no external dependencies)
const BrainIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

interface NavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const UnifiedNavigation: React.FC<NavigationProps> = ({ currentModule, onModuleChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const modules = [
    {
      id: 'psychology',
      name: 'Psychology',
      icon: BrainIcon,
      color: 'bg-purple-500',
      routes: [
        { path: '/psychology/dailyhub', name: 'Daily Hub' },
        { path: '/psychology/evaluations/report-writer', name: 'Report Writer ⭐' },
        { path: '/psychology/business', name: 'Business Management' },
      ]
    },
    {
      id: 'trading',
      name: 'Trading',
      icon: TrendingUpIcon,
      color: 'bg-green-500',
      routes: [
        { path: '/trading/dashboard', name: 'EMA Assessment' },
        { path: '/trading/patterns', name: 'Pattern Analysis' },
        { path: '/trading/history', name: 'Trading History' },
      ]
    },
    {
      id: 'insights',
      name: 'Cross-Insights',
      icon: BarChartIcon,
      color: 'bg-blue-500',
      routes: [
        { path: '/insights/dashboard', name: 'Analytics Dashboard' },
        { path: '/insights/correlations', name: 'Behavioral Correlations' },
        { path: '/insights/recommendations', name: 'AI Recommendations' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">PivotPoint Platform</h1>
          <p className="text-sm text-gray-500">Unified Assessment Hub</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div key={module.id} className="space-y-1">
                <button
                  onClick={() => {
                    onModuleChange(module.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${currentModule === module.id 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div className={`p-2 rounded-md ${module.color}`}>
                    <IconComponent />
                  </div>
                  <span className="font-medium">{module.name}</span>
                </button>
                
                {/* Sub-routes */}
                {currentModule === module.id && (
                  <div className="ml-12 space-y-1">
                    {module.routes.map((route) => (
                      <a
                        key={route.path}
                        href={route.path}
                        className="block px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      >
                        {route.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <UserIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
              <SettingsIcon />
              <span className="ml-1">Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
              <LogOutIcon />
              <span className="ml-1">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

// Main App Layout Component
const UnifiedPlatformLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState('psychology');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UnifiedNavigation 
        currentModule={currentModule} 
        onModuleChange={setCurrentModule} 
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              {/* Mobile header content */}
            </div>
            
            {/* Module Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Psychology Module Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Trading Module Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cross-Insights Active</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200">
                New Report
              </button>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                Risk Assessment
              </button>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                View Insights
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Cross-Module Insights Dashboard
const CrossModuleInsights: React.FC = () => {
  const [insights] = useState([
    {
      id: 1,
      type: 'behavioral_correlation',
      title: 'Stress & Trading Performance Correlation',
      description: 'Users with high psychology stress scores show 23% lower trading success rates.',
      impact: 'high',
      recommendation: 'Implement mindfulness training for high-stress traders.',
      confidence: 87
    },
    {
      id: 2,
      type: 'decision_pattern',
      title: 'Anxiety vs Risk Taking',
      description: 'Anxiety levels correlate with aggressive trading positions (r=0.67).',
      impact: 'medium',
      recommendation: 'Suggest risk adjustment based on psychological assessment.',
      confidence: 74
    },
    {
      id: 3,
      type: 'timing_optimization',
      title: 'Cognitive Load & Decision Quality',
      description: 'Decision quality decreases by 15% during high cognitive load periods.',
      impact: 'medium',
      recommendation: 'Schedule important trading decisions during low-stress periods.',
      confidence: 91
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cross-Module Insights</h1>
          <p className="text-gray-600">AI-powered correlations between psychology and trading data</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Active Correlations</h3>
          <p className="text-2xl font-bold text-blue-600">{insights.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">High Impact Insights</h3>
          <p className="text-2xl font-bold text-red-600">
            {insights.filter(i => i.impact === 'high').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Avg Confidence</h3>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Recommendations</h3>
          <p className="text-2xl font-bold text-purple-600">{insights.length}</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getImpactColor(insight.impact)}`}>
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{insight.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Recommendation:</strong> {insight.recommendation}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm text-gray-500">Confidence</div>
                <div className="text-xl font-bold text-gray-900">{insight.confidence}%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Type: {insight.type.replace('_', ' ').toUpperCase()}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  View Details
                </button>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Implement
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lex Integration Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h4 className="font-semibold text-gray-900">🤖 Lex AI Integration Active</h4>
            <p className="text-sm text-gray-600">
              Continuously analyzing cross-domain patterns and generating real-time insights from your psychology and trading data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedPlatformLayout;
export { CrossModuleInsights };