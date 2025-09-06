import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { initialized } = useAuth();

  if (!initialized) return <div className="p-6">Carregando…</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
