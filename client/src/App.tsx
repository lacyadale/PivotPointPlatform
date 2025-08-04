// client/src/App.tsx
import React from 'react';
import UnifiedPlatformLayout from './components/layout/UnifiedNavigation';

function App() {
  return (
    <UnifiedPlatformLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to PivotPoint Platform</h1>
        <p>Your unified psychology and trading assessment platform.</p>
      </div>
    </UnifiedPlatformLayout>
  );
}

export default App;