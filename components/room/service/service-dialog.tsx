'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service, VenueAccount } from '@/lib/types';
import { ServiceCard } from './service-card';
import Image from 'next/image';
import { H2, H4, P } from '@/components/shared/typography';
import { useState } from 'react';
import ServiceBookConfirm from './service-book-confirm';
import BanquetLayout from '@/components/employee/banquet/banquet-layout';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ServiceDialogProps {
  service: Service;
  account: VenueAccount;
}
/**
 * ServiceDialog - Represents the dialog that is opened once the service card is pressed.
 * @param service The service to show in the dialog.
 */
export function ServiceDialog({ service, account }: ServiceDialogProps) {
  const [serviceDialogOpen, setServiceDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const handleBookService = () => {
    setServiceDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const isBanquet = service.name.toLowerCase().includes('banquete');

  return (
    <>
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogTrigger>
          <ServiceCard service={service} />
        </DialogTrigger>
        <DialogContent className="font-base text-white p-0 max-h-[90vh] overflow-hidden">
          <ScrollArea className="h-full max-h-[90vh]">
            <DialogHeader>
              <Image
                className="w-full object-cover"
                src={service.image}
                alt={service.name}
                width={500}
                height={300}
              />
              <div className="p-6">
                <DialogTitle asChild className="text-white font-titles">
                  <H2>{service.name}</H2>
                </DialogTitle>
                <DialogDescription asChild>
                  <P>{service.description}</P>
                </DialogDescription>
              </div>
            </DialogHeader>
            <section className="flex flex-col gap-4 px-6 py-2 -mt-5 pb-6">
              <div className="flex items-center gap-4">
                <H4 className="font-semibold">Precio:</H4>
                <P>{service.eiltRate ? `${service.eiltRate} EILT` : 'N/A'}</P>
              </div>
              <div className="flex items-center gap-4">
                <H4 className="font-semibold">Rating:</H4>
                <P>{service.rating ? `${service.rating} / 5` : 'No ratings'}</P>
              </div>

              <button
                className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
                type="button"
                onClick={handleBookService}
              >
                Agendar Servicio
              </button>
            </section>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {isBanquet ? (
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="max-w-none sm:max-w-[90vw] h-[90vh] overflow-hidden bg-[var(--background)] text-white border border-[var(--gold)]/30 shadow-xl rounded-2xl">
            <ScrollArea className="h-full max-h-[90vh]">
              <VisuallyHidden>
                <DialogTitle>Banquete</DialogTitle>
              </VisuallyHidden>
              <BanquetLayout service={service} account={account} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      ) : (
        <ServiceBookConfirm
          service={service}
          account={account}
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
        />
      )}
    </>
  );
}
