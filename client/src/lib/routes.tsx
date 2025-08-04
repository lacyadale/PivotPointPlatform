import { Switch, Route } from 'wouter';
import { Dashboard } from '../pages/dashboard/Overview';
import { PsychologyDashboard } from '../pages/psychology/Dashboard';
import { TradingDashboard } from '../pages/trading/Dashboard';

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/psychology" component={PsychologyDashboard} />
      <Route path="/trading" component={TradingDashboard} />
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}
