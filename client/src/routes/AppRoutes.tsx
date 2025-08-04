import React from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';

// Psychology Module Components (Your existing components)
import DailyHub from '@/pages/psychology/Dimport React from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';

// Psychology Module Components (Your existing components)
import DailyHub from '@/pages/psychology/DailyHub';
import EvaluationsList from '@/pages/psychology/evaluations/List';
import NewEvaluation from '@/pages/psychology/evaluations/New';
import EvaluationDetail from '@/pages/psychology/evaluations/Detail';
import ReportWriter from '@/pages/psychology/evaluations/ReportWriter';
import Business from '@/pages/psychology/Business';

// Trading Module Components (EMA System)
import TradingDashboard from '@/pages/trading/Dashboard';
import EMAAnalysis from '@/pages/trading/EMAAnalysis';

// Insights Module Components
import CrossDomainInsights from '@/pages/insights/CrossDomainAnalytics';

// Main Dashboard
import UnifiedDashboard from '@/pages/dashboard/Overview';

// Layout Component
import MainLayout from '@/components/layout/MainLayout';

const Navigate = ({ to }: { to: string }) => <Redirect to={to} />;

export default function AppRoutes() {
  return (
    <MainLayout>
      <Router>
        <Switch>
          {/* Main Dashboard */}
          <Route path="/" component={() => <Navigate to="/dashboard" />} />
          <Route path="/dashboard" component={UnifiedDashboard} />

          {/* Psychology Module Routes */}
          <Route path="/psychology" component={() => <Navigate to="/psychology/daily-hub" />} />
          <Route path="/psychology/daily-hub" component={DailyHub} />
          <Route path="/psychology/business" component={Business} />
          
          {/* Evaluation Routes */}
          <Route path="/psychology/evaluations" component={EvaluationsList} />
          <Route path="/psychology/evaluations/new" component={NewEvaluation} />
          <Route path="/psychology/evaluations/:id">
            {(params) => <EvaluationDetail id={params.id} />}
          </Route>
          <Route path="/psychology/evaluations/report-writer" component={ReportWriter} />

          {/* Trading Module Routes */}
          <Route path="/trading" component={() => <Navigate to="/trading/dashboard" />} />
          <Route path="/trading/dashboard" component={TradingDashboard} />
          <Route path="/trading/ema-analysis" component={EMAAnalysis} />

          {/* Insights Module Routes */}
          <Route path="/insights" component={() => <Navigate to="/insights/cross-domain" />} />
          <Route path="/insights/cross-domain" component={CrossDomainInsights} />

          {/* Catch-all redirect */}
          <Route component={() => <Navigate to="/dashboard" />} />
        </Switch>
      </Router>
    </MainLayout>
  );
}ailyHub';
import EvaluationsList from '@/pages/psychology/evaluations/List';
import NewEvaluation from '@/pages/psychology/evaluations/New';
import EvaluationDetail from '@/pages/psychology/evaluations/Detail';
import ReportWriter from '@/pages/psychology/evaluations/ReportWriter';
import Business from '@/pages/psychology/Business';

// Trading Module Components (EMA System)
import TradingDashboard from '@/pages/trading/Dashboard';
import EMAAnalysis from '@/pages/trading/EMAAnalysis';

// Insights Module Components
import CrossDomainInsights from '@/pages/insights/CrossDomainAnalytics';

// Main Dashboard
import UnifiedDashboard from '@/pages/dashboard/Overview';

// Layout Component
import MainLayout from '@/components/layout/MainLayout';

export default function AppRoutes() {
  return (
    <MainLayout>
      <Router>
        <Switch>
          {/* Main Dashboard */}
          <Route path="/" component={() => <Navigate to="/dashboard" />} />
          <Route path="/dashboard" component={UnifiedDashboard} />

          {/* Psychology Module Routes */}
          <Route path="/psychology" component={() => <Navigate to="/psychology/daily-hub" />} />
          <Route path="/psychology/daily-hub" component={DailyHub} />
          <Route path="/psychology/business" component={Business} />
          
          {/* Evaluation Routes */}
          <Route path="/psychology/evaluations" component={EvaluationsList} />
          <Route path="/psychology/evaluations/new" component={NewEvaluation} />
          <Route path="/psychology/evaluations/:id" component={EvaluationDetail} />
          <Route path="/psychology/evaluations/report-writer" component={ReportWriter} />

          {/* Trading Module Routes */}
          <Route path="/trading" component={() => <Navigate to="/trading/dashboard" />} />
          <Route path="/trading/dashboard" component={TradingDashboard} />
          <Route path="/trading/ema-analysis" component={EMAAnalysis} />

          {/* Insights Module Routes */}
          <Route path="/insights" component={() => <Navigate to="/insights/cross-domain" />} />
          <Route path="/insights/cross-domain" component={CrossDomainInsights} />

          {/* Catch-all redirect */}
          <Route component={() => <Navigate to="/dashboard" />} />
        </Switch>
      </Router>
    </MainLayout>
  );
}