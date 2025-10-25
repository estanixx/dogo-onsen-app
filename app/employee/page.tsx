import { AuthRequired } from '@/components/employee/auth/auth-required';
import { DogoHeader } from '@/components/shared/dogo-ui';
import { DashboardStats } from '@/components/employee/dashboard/dashboard-stats';
import { DashboardCharts } from '@/components/employee/dashboard/dashboard-charts';
import { DashboardAlerts } from '@/components/employee/dashboard/dashboard-alerts';

export default function EmployeePage() {
  return (
    <AuthRequired>
      <DogoHeader title="Panel de Control" subtitle="Vista general de operaciones" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCharts />
        <DashboardStats />
        <DashboardAlerts />
      </div>
    </AuthRequired>
  );
}
