'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import CheckInForm from '@/components/employee/reception/checkin-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpiritGrid from '@/components/employee/reception/spirit-grid';

export default function CheckInPage() {
  return (
    <DogoSection className="border-2 border-white rounded-lg object-cover w-full text-white grid grid-cols-1 md:grid-cols-3">
      <CheckInForm />

      {/* Main area */}
      <main className="overflow-y-auto p-6 col-span-2 ">
        <Tabs defaultValue="checkin" className="w-full" >
          <TabsList className='w-1/2'>
            <TabsTrigger value="checkin" className='text-white'>Registro</TabsTrigger>
            <TabsTrigger value="spirits" className='text-white'>Espíritus</TabsTrigger>
          </TabsList>
          <TabsContent value="checkin">Próximamente: vista general del check-in 🏯</TabsContent>
          <TabsContent value="spirits"><SpiritGrid /></TabsContent>
        </Tabs>
        
      </main>
    </DogoSection>
  );
}
