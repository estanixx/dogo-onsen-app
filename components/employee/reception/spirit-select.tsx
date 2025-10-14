'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import SpiritForm from './spirit-form';
import clsx from 'clsx';

interface SpiritSelectProps {
  id: string;
  setId: (id: string) => void;
}

export default function SpiritSelect({ id, setId }: SpiritSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
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
      <DrawerContent className={clsx(sharedClass, 'px-4')}>
        <DrawerHeader>
          <DrawerTitle>Buscar / Crear Espíritu</DrawerTitle>
          <DrawerDescription>
            Ingrese el número de identificación para buscar o crear un registro.
          </DrawerDescription>
        </DrawerHeader>
        <SpiritForm id={id} setId={setId} setOpen={setOpen} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
