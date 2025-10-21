import Navbar from '@/components/layout/navbar';
import { DogoPage } from '@/components/shared/dogo-ui';
import { EmployeeProvider } from '@/app/context/employee-context';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmployeeProvider>
      <DogoPage>
        <Navbar />
        <div className="mt-26 px-3 w-full lg:w-3/4">{children}</div>
      </DogoPage>
    </EmployeeProvider>
  );
}
