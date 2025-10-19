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
import { getInventoryItems } from '@/lib/api';
import { InventoryItem } from '@/lib/types';

interface InventoryTableProps {
  onAddOrder?: () => void;
}

export function InventoryTable({ onAddOrder }: InventoryTableProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadInventory() {
      try {
        const items = await getInventoryItems();
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
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[var(--dark-light)] to-[var(--dark)]">
              <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3">
                Producto
              </TableHead>
              <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3">
                Cantidad
              </TableHead>
              <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3">
                Unidad
              </TableHead>
              <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3">
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
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-white">{item.name}</TableCell>
                  <TableCell
                    className={`text-white ${item.quantity < 12 ? 'text-red-500 font-bold' : ''}`}
                  >
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-white">{item.unit}</TableCell>
                  <TableCell className="text-white">
                    {item.quantity < 12 ? (
                      <span className="text-red-500 font-bold">Bajo inventario</span>
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
