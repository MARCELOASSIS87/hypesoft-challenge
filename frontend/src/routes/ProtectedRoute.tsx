import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { initialized, authenticated } = useAuth();

  if (!initialized) return <div className="p-6">Carregando…</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
