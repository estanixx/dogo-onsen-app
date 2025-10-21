import { AuthRequired } from '@/components/employee/auth/auth-required';

export default function EmployeePage() {
  return (
    <AuthRequired>
      <div className="text-white">Employee Dashboard Content</div>
    </AuthRequired>
  );
}
