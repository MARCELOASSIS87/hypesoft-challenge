import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { profile, realmRoles, clientRoles, logout } = useAuth();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo, {profile?.name ?? profile?.preferred_username ?? 'usuário'}.</p>
      </div>

      <div className="space-y-2">
        <p><strong>Realm Roles:</strong> {realmRoles.join(', ') || '—'}</p>
        <p><strong>Client Roles:</strong> {clientRoles.join(', ') || '—'}</p>
      </div>

      <Button variant="destructive" onClick={logout}>Sair</Button>
    </div>
  );
};

export default Dashboard;
