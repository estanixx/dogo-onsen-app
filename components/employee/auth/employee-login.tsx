'use client';

// AQUÍ TENEMOS QUE USAR CLERK

import { useState } from 'react';
import { useEmployee } from '@/context/employee-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function EmployeeLogin() {
  const { isAuthenticated, employee, login, logout } = useEmployee();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState('');
  const [pin, setPin] = useState('');

  // Registration modal state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regUser, setRegUser] = useState('');
  const [regName, setRegName] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regState, setRegState] = useState<'idle' | 'success' | 'error'>('idle');
  const [regError, setRegError] = useState('');
  const { register } = useEmployee();
  const [loading, setLoading] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginState('loading');
    let success = false;
    try {
      success = await login(user, pin);
      if (success) {
        setLoginState('success');
        setTimeout(() => setLoginState('idle'), 2000);
      } else {
        setLoginState('error');
      }
    } catch (error) {
      setLoginState('error');
    }
    setLoading(false);

    if (!success) {
      setTimeout(() => setLoginState('idle'), 2000);
    }

    setUser('');
    setPin('');
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {isAuthenticated && employee ? (
          <>
            <span className="text-gold">{employee.name}</span>
            <Button
              onClick={logout}
              variant="outline"
              className="font-semibold rounded-md bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]"
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="font-semibold rounded-md bg-[var(--gold)] text-[var(--dark)] hover:bg-[var(--gold-light)]"
          >
            Iniciar Sesión
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="
          max-w-md rounded-2xl border
          border-[var(--gold)]
          bg-[var(--dark-light)]
          text-[var(--smoke)]
          shadow-[0_0_25px_var(--gold)]
        "
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-[var(--gold)] text-center font-serif">
              Iniciar Sesión de Empleado
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Ingresa tu Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="px-3 py-2 rounded-md border text-[var(--smoke)] bg-[var(--dark)] border-[var(--gold-dark)] placeholder:text-[color:var(--gold-light)]/50"
              required
            />
            <Input
              type="password"
              placeholder="Ingresa tu PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="px-3 py-2 rounded-md border text-[var(--smoke)] bg-[var(--dark)] border-[var(--gold-dark)] placeholder:text-[color:var(--gold-light)]/50"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className={
                `w-full font-semibold rounded-md text-[var(--dark)] transition-colors ` +
                (loginState === 'success'
                  ? 'bg-secondary hover:bg-secondary-light'
                  : loginState === 'error'
                    ? 'bg-destructive hover:bg-destructive-light'
                    : 'bg-[var(--gold)] hover:bg-[var(--gold-light)]')
              }
            >
              {loginState === 'loading'
                ? 'Verificando...'
                : loginState === 'success'
                  ? '¡Sesión Iniciada!'
                  : loginState === 'error'
                    ? 'Error'
                    : 'Entrar'}
            </Button>
            <Button
              type="button"
              className={
                'w-full font-semibold border border-[var(--gold)] rounded-md text-[var(--gold)] transition-colors bg-[var(--dark)] hover:bg-[var(--dark-light)]'
              }
              onClick={() => setRegisterOpen(true)}
            >
              Registrarse
            </Button>
            {/* Registration Dialog */}
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogContent className="max-w-md rounded-2xl border border-[var(--gold)] bg-[var(--dark-light)] text-[var(--smoke)] shadow-[0_0_25px_var(--gold)]">
                <DialogHeader>
                  <DialogTitle className="text-xl text-[var(--gold)] text-center font-serif">
                    Registro de Empleado
                  </DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setRegLoading(true);
                    setRegState('idle');
                    setRegError('');
                    const res = await register(regUser, regName, regPin);
                    if (res.ok) {
                      setRegState('success');
                      setTimeout(() => setRegState('idle'), 2000);
                      setTimeout(() => setRegisterOpen(false), 2000);
                      setTimeout(() => setIsOpen(false), 2000);
                    } else {
                      setRegState('error');
                      setRegError(res.error || 'Error al registrar');
                    }
                    setRegLoading(false);
                    if (!res.ok) {
                      setTimeout(() => setRegState('idle'), 2000);
                    }
                    setRegName('');
                    setRegUser('');
                    setRegPin('');
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Usuario"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    className="px-3 py-2 rounded-md border text-[var(--smoke)] bg-[var(--dark)] border-[var(--gold-dark)] placeholder:text-[color:var(--gold-light)]/50 focus:outline-none focus:border-[var(--gold-light)]"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Nombre completo"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="px-3 py-2 rounded-md border text-[var(--smoke)] bg-[var(--dark)] border-[var(--gold-dark)] placeholder:text-[color:var(--gold-light)]/50 focus:outline-none focus:border-[var(--gold-light)]"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="PIN"
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    className="px-3 py-2 rounded-md border text-[var(--smoke)] bg-[var(--dark)] border-[var(--gold-dark)] placeholder:text-[color:var(--gold-light)]/50 focus:outline-none focus:border-[var(--gold-light)]"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={regLoading}
                    className={
                      `w-full font-semibold rounded-md text-[var(--dark)] transition-colors ` +
                      (regState === 'success'
                        ? 'bg-secondary hover:bg-secondary-light'
                        : regState === 'error'
                          ? 'bg-destructive hover:bg-destructive-light'
                          : 'bg-[var(--gold)] hover:bg-[var(--gold-light)]')
                    }
                  >
                    {regLoading
                      ? 'Registrando...'
                      : regState === 'success'
                        ? '¡Registrado!'
                        : regState === 'error'
                          ? regError || 'Error'
                          : 'Registrarse'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
