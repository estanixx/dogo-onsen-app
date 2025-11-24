'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Employee {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  estado: string;
  is_admin: boolean;
}

export function EmployeesManagementTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/employees/admin/employees', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateEmployeeStatus = async (clerkId: string, newStatus: string) => {
    try {
      setUpdatingIds((prev) => new Set([...prev, clerkId]));

      const response = await fetch(`/api/employees/admin/employees/${clerkId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      // Update local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.clerk_id === clerkId ? { ...emp, estado: newStatus } : emp,
        ),
      );
      toast.success(`Estado actualizado a ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast.error('Error al actualizar el estado del empleado');
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(clerkId);
        return newSet;
      });
    }
  };

  const makeEmployeeAdmin = async (clerkId: string) => {
    try {
      setUpdatingIds((prev) => new Set([...prev, clerkId]));

      const response = await fetch(`/api/employees/admin/employees/${clerkId}/make-admin`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to make employee admin');
      }

      toast.success('¡El empleado ahora es administrador!');
      // Refresh the employees list
      await fetchEmployees();
    } catch (error) {
      console.error('Error making employee admin:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(clerkId);
        return newSet;
      });
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'approved':
        return 'Aprobado';
      case 'revoked':
        return 'Suspendido';
      case 'pendiente':
        return 'Pendiente';
      default:
        return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="border border-[var(--gold)]/30 rounded-lg overflow-hidden shadow-md">
        <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[var(--dark-light)] to-[var(--dark)] sticky top-0 z-10">
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 px-2 md:px-3 whitespace-nowrap min-w-[120px] md:min-w-[150px] text-xs md:text-sm">
                      Nombre
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 px-2 md:px-3 whitespace-nowrap min-w-[150px] md:min-w-[200px] text-xs md:text-sm">
                      Email
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 px-2 md:px-3 whitespace-nowrap text-xs md:text-sm">
                      Rol
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 px-2 md:px-3 whitespace-nowrap text-xs md:text-sm">
                      Estado
                    </TableHead>
                    <TableHead className="text-[var(--gold)] font-serif tracking-wider py-3 px-2 md:px-3 whitespace-nowrap text-xs md:text-sm">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-white py-8 text-sm">
                        Cargando empleados...
                      </TableCell>
                    </TableRow>
                  ) : employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-white/50 py-8 text-sm">
                        No hay empleados registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow
                        key={employee.clerk_id}
                        className="hover:bg-white/5 border-b border-white/5"
                      >
                        <TableCell className="text-white font-medium whitespace-nowrap px-2 md:px-3 py-2 text-xs md:text-sm">
                          {employee.first_name} {employee.last_name}
                        </TableCell>
                        <TableCell className="text-white/90 whitespace-nowrap px-2 md:px-3 py-2 text-xs md:text-sm break-all md:break-normal">
                          {employee.email}
                        </TableCell>
                        <TableCell className="text-white/75 capitalize whitespace-nowrap px-2 md:px-3 py-2 text-xs md:text-sm">
                          {employee.role}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 md:px-3 py-2">
                          <Badge className={`${getStatusBadgeColor(employee.estado)} text-xs`}>
                            {getStatusLabel(employee.estado)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 md:px-3 py-2">
                          <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                            <Select
                              value={employee.estado}
                              onValueChange={(value: string) =>
                                updateEmployeeStatus(employee.clerk_id, value)
                              }
                              disabled={updatingIds.has(employee.clerk_id)}
                            >
                              <SelectTrigger className="w-24 md:w-28 h-7 md:h-8 text-xs bg-white/5 border-white/10 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="approved">Aprobar</SelectItem>
                                <SelectItem value="revoked">Suspender</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => makeEmployeeAdmin(employee.clerk_id)}
                              disabled={updatingIds.has(employee.clerk_id) || employee.is_admin}
                              size="sm"
                              className="h-7 md:h-8 text-xs bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-[var(--dark)] font-medium whitespace-nowrap"
                            >
                              {updatingIds.has(employee.clerk_id) ? (
                                <Loader2 className="animate-spin w-3 h-3" />
                              ) : employee.is_admin ? (
                                'Es Admin'
                              ) : (
                                'Hacer Admin'
                              )}
                            </Button>
                          </div>
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
    </div>
  );
}
