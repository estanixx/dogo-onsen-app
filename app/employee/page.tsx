import { AuthRequired } from '@/components/employee/auth/auth-required';
import { DashboardAlerts } from '@/components/employee/dashboard/dashboard-alerts';
import { DashboardCharts } from '@/components/employee/dashboard/dashboard-charts';
import { DashboardStats } from '@/components/employee/dashboard/dashboard-stats';
import { DogoHeader } from '@/components/shared/dogo-ui';
import { getDashboardData } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function EmployeePage() {
  const dashboardData = await getDashboardData();
  return (
    <AuthRequired>
      <DogoHeader title="Panel de Control" className="-mt-16" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCharts data={dashboardData} />
        <DashboardStats data={dashboardData} />
        <DashboardAlerts data={dashboardData} />
      </div>
    </AuthRequired>
  );
}
