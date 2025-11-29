'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCreateForm } from '@/components/employee/service/service-create-form';
import { Service } from '@/lib/types';
import { AuthRequired } from '@/components/employee/auth/auth-required';
import { DogoSection, DogoHeader } from '@/components/shared/dogo-ui';
import { createService, getAvailableServices } from '@/lib/api';
import { LoadingBar, LoadingBox } from '@/components/shared/loading';
import { ServiceCard } from '@/components/employee/service/service-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import ReservationSidebar from '@/components/employee/service/reservation-sidebar';
import { toast } from 'sonner';

export default function ServicesManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  const setSidebarOpen = (open: boolean) => {
    if (!open) {
      setService(null);
    }
  };

  const handleCreateService = async (serviceData: Omit<Service, 'id' | 'rating'>) => {
    // Por ahora solo simulamos la creación
    const service = await createService(serviceData as Service);
    console.log('Servicio creado:', service);
    if (!service) {
      toast.error('Error al crear el servicio. Inténtalo de nuevo.');
      return;
    }
    toast.success('Servicio creado exitosamente.');
    setServices((prev) => [service, ...prev]);
    // Aquí iría la lógica para crear el servicio cuando implementemos el backend
  };

  useEffect(() => {
    setLoading(true);
    const fetchServices = async () => {
      const availableServices = await getAvailableServices();
      setServices(availableServices);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <AuthRequired>
      <DogoHeader title="Servicios" className="-mt-16" />
      <div className="border-2 border-white rounded-lg text-foreground mb-5">
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
            <ScrollArea className="md:max-h-[50rem] max-h-screen h-[30rem]">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Mensaje cuando no hay servicios */}
                {loading ? (
                  <LoadingBox className="text-white col-span-full h-72">
                    Cargando servicios...
                  </LoadingBox>
                ) : services.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gold/30 bg-card/30 backdrop-blur-sm p-12 text-center">
                    <div className="rounded-full bg-gold/10 p-4">
                      <Sparkles className="h-8 w-8 text-[var(--gold)]/60" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-[var(--gold)]">
                        No hay servicios registrados
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-[500px]">
                        Comienza creando un nuevo servicio para los huéspedes del onsen. Los
                        servicios aparecerán aquí una vez creados.
                      </p>
                    </div>
                  </div>
                ) : (
                  services.map((service) => (
                    <ServiceCard key={service.id} service={service} onSelect={setService} />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <SidebarProvider
        open={!!service}
        onOpenChange={setSidebarOpen}
        style={
          {
            ['--sidebar-width']: '25rem',
            ['--sidebar-width-mobile']: '100%',
          } as CSSProperties
        }
        className={'w-0 h-0 absolute overflow-hidden'}
      >
        <Sidebar
          side="right"
          variant="floating"
          collapsible="offcanvas"
          mobileWidth="100%"
          className="z-99 overflow-hidden "
        >
          <SidebarContent className="overflow-hidden">
            {service && <ReservationSidebar service={service as Service} />}
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <ServiceCreateForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateService}
      />
    </AuthRequired>
  );
}
