'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateEmployee, registerEmployee } from '@/lib/api';

interface Employee {
  id: string;
  name: string;
  role: string;
}

interface EmployeeContextType {
  isAuthenticated: boolean;
  employee: Employee | null;
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string,
    name: string,
    pin: string,
    role?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee-data');
    if (storedEmployee) {
      const data = JSON.parse(storedEmployee);
      setEmployee(data);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, pin: string) => {
    const employeeData = await authenticateEmployee(username, pin);
    if (employeeData) {
      setEmployee(employeeData);
      setIsAuthenticated(true);
      localStorage.setItem('employee-data', JSON.stringify(employeeData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setEmployee(null);
    setIsAuthenticated(false);
    localStorage.removeItem('employee-data');
  };

  const register = async (username: string, name: string, pin: string, role?: string) => {
    try {
      const employeeData = await registerEmployee({ username, name, pin, role });
      setEmployee(employeeData);
      setIsAuthenticated(true);
      localStorage.setItem('employee-data', JSON.stringify(employeeData));
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  return (
    <EmployeeContext.Provider value={{ isAuthenticated, employee, login, logout, register }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}
