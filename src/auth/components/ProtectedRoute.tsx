
import React from 'react';
import { useAuthStore } from '../useAuthStore';
import { LoginPage } from './LoginPage';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  
  const { isAuthenticated } = useAuthStore();

  
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  
  return <>{children}</>;
}