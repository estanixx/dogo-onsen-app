"use client";

import { DogoSection } from "@/components/shared/dogo-ui";
import CheckInForm from "@/components/employee/reception/checkin-form";

export default function CheckInPage() {
  return (
    <DogoSection className="border-2 border-white rounded-lg object-cover flex w-full text-white">
      <CheckInForm />

      {/* Main area */}
      <main className="flex-1 overflow-y-auto p-6">
        Próximamente: vista general del check-in 🏯
      </main>
      
    </DogoSection>
  );
}
