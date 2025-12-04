'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table-component';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getItems } from '@/lib/api';
import { Item } from '@/lib/types';

interface InventoryTableProps {
  onAddOrder?: () => void;
}

export function InventoryTable({ onAddOrder }: InventoryTableProps) {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadInventory() {
      try {
        const items = await getItems();
        setInventoryItems(items);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInventory();
  }, []);

  const filteredItems = inventoryItems.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Input
          placeholder="Buscar producto..."
          className="max-w-xs text-white border-white/30 placeholder:text-white/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border border-[var(--gold)]/30 rounded-lg overflow-hidden shadow-md">
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[var(--dark-light)] to-[var(--dark)] sticky top-0 z-10">
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 whitespace-nowrap min-w-[200px]">
                      Producto
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 whitespace-nowrap">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 whitespace-nowrap">
                      Unidad
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 whitespace-nowrap min-w-[150px]">
                      Estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-white">
                        Cargando inventario...
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-white">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-white/5">
                        <TableCell className="font-medium text-white whitespace-nowrap">
                          {item.name}
                        </TableCell>
                        <TableCell
                          className={`text-white whitespace-nowrap ${
                            (item.quantity ?? 0) < 12 ? 'text-destructive font-bold' : ''
                          }`}
                        >
                          {item.quantity ?? 0}
                        </TableCell>
                        <TableCell className="text-white whitespace-nowrap">{item.unit}</TableCell>
                        <TableCell className="text-white whitespace-nowrap">
                          {(item.quantity ?? 0) < 12 ? (
                            <span className="text-destructive font-bold">Bajo inventario</span>
                          ) : (
                            <span className="text-secondary">Suficiente</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={onAddOrder}
          className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-[var(--dark)] font-medium"
        >
          <Plus size={16} className="font-bold" />
          Realizar pedido
        </Button>
      </div>
    </div>
  );
}
