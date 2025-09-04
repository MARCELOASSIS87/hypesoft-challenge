import React from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  roles: string[];
  children: React.ReactNode;
};

const WithRoles: React.FC<Props> = ({ roles, children }) => {
  const { hasRoles } = useAuth();

  if (!hasRoles(roles)) {
    return <div className="p-6 text-red-600 font-medium">Acesso negado</div>;
  }

  return <>{children}</>;
};

export default WithRoles;
