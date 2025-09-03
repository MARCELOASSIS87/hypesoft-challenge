import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Topbar: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">
        {/* Org selector (dummy) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="font-medium">UnitedMen</div>
          <div className="text-muted-foreground text-sm">▼</div>
        </div>

        {/* Tabs (overview only as active) */}
        <nav className="hidden xl:flex ml-6 items-center gap-2 text-sm">
          {['Overview', 'Product List', 'Inventory Management', 'Sales Performance', 'Marketing', 'Customer Feedback'].map((t) => (
            <div
              key={t}
              className={
                t === 'Overview'
                  ? 'px-3 py-1.5 rounded-full bg-indigo-600/10 text-indigo-700'
                  : 'px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted cursor-default'
              }
            >
              {t}
            </div>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Input placeholder="Search…" className="w-64 pl-9" />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">🔎</span>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">🔔</Button>
          <Button variant="ghost" size="icon" className="rounded-full">⚙️</Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-3 ml-1 border-l">
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-sm font-medium">{profile?.name ?? profile?.preferred_username ?? 'User'}</div>
              <div className="text-xs text-muted-foreground">Shop Admin</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white grid place-items-center">
              {(profile?.name ?? 'U').slice(0, 1).toUpperCase()}
            </div>
            <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
