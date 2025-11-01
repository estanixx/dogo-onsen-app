'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCreateForm } from '@/components/employee/service/service-create-form';
import { Service } from '@/lib/types';
import { AuthRequired } from '@/components/employee/auth/auth-required';
import { DogoHeader } from '@/components/shared/dogo-ui';

export default function ServicesManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateService = async (serviceData: Omit<Service, 'id' | 'rating'>) => {
    // Por ahora solo simulamos la creación
    console.warn('Crear servicio:', serviceData);
    // Aquí iría la lógica para crear el servicio cuando implementemos el backend
  };

  return (
    <AuthRequired>
      <div className="min-h-screen bg-background text-foreground">
        <DogoHeader title="Servicios" className="-mt-16" />
        <div className="flex flex-col gap-8 p-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="font-titles text-4xl font-bold text-[var(--gold)] tracking-tight">
              Servicios del Onsen
            </h1>
            <p className="text-lg text-muted-foreground">
              Gestiona los servicios disponibles para los huéspedes
            </p>
          </div>

          {/* Main Content Section */}
          <div className="grid gap-6">
            {/* Search and Actions Card */}
            <div className="rounded-xl border border-gold/30 bg-card/30 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                <div className="flex-1 space-y-1">
                  <h2 className="font-titles text-xl sm:text-2xl font-semibold text-[var(--gold)]">
                    Gestión de Servicios
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Crea y administra los servicios del dogo onsen
                  </p>
                </div>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="default"
                  className="w-full sm:w-auto duration-300"
                >
                  <span className="sm:hidden">Nuevo servicio</span>
                  <span className="hidden sm:inline">Crear nuevo servicio</span>
                </Button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Mensaje cuando no hay servicios */}
              <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gold/30 bg-card/30 backdrop-blur-sm p-12 text-center">
                <div className="rounded-full bg-gold/10 p-4">
                  <Sparkles className="h-8 w-8 text-[var(--gold)]/60" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--gold)]">
                    No hay servicios registrados
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[500px]">
                    Comienza creando un nuevo servicio para los huéspedes del onsen. Los servicios
                    aparecerán aquí una vez creados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ServiceCreateForm
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateService}
        />
      </div>
    </AuthRequired>
  );
}
