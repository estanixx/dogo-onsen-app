'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { useMediaQuery } from '@/hooks/use-media-query';
import { DESKTOP_MIN_QUERY } from '@/lib/config';
import clsx from 'clsx';
import * as React from 'react';
import SpiritForm from './spirit-form';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface SpiritSelectProps {
  id: number;
  setId: (id: string) => void;
}

export default function SpiritSelect({ id, setId }: SpiritSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery(DESKTOP_MIN_QUERY);
  const sharedClass = 'text-white';
  const btn = <Button variant="outline">{id ? `Espíritu #${id}` : 'Buscar Espíritu'}</Button>;
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{btn}</DialogTrigger>
        <DialogContent className={clsx(sharedClass, 'o')}>
          <DialogHeader>
            <DialogTitle>Buscar / Crear Espíritu</DialogTitle>
            <DialogDescription>
              Ingrese el número de identificación para buscar o crear un registro.
            </DialogDescription>
          </DialogHeader>
          <SpiritForm id={id} setId={setId} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{btn}</DrawerTrigger>
      <DrawerContent
        className={clsx(sharedClass, 'px-4 max-h-[100vh] flex flex-col overflow-hidden')}
      >
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Buscar / Crear Espíritu</DrawerTitle>
          <DrawerDescription>
            Ingrese el número de identificación para buscar o crear un registro.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-0 pb-4">
            <SpiritForm id={id} setId={setId} setOpen={setOpen} />
          </div>
        </ScrollArea>

        <DrawerFooter className="flex-shrink-0">
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
