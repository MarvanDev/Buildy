// src/auth/components/ProtectedRoute.tsx
import React from 'react';
import { useAuthStore } from '../useAuthStore';
import { LoginPage } from './LoginPage';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  // Leemos el estado global de zustand que hizo el encargado de TS01
  const { isAuthenticated } = useAuthStore();

  // Si no está logueado, le bloqueamos el paso y le mostramos el Login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Si está logueado, le permitimos ver a los "hijos" (el Wizard)
  return <>{children}</>;
}