import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Topbar: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3 min-w-0 flex-nowrap">
        {/* Org selector (dummy) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="font-medium">UnitedMen</div>
          <div className="text-muted-foreground text-sm">▼</div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">

          <Button variant="ghost" size="icon" className="rounded-full">🔔</Button>
          <Button variant="ghost" size="icon" className="rounded-full">⚙️</Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-3 ml-1 border-l">
            {/* Avatar à esquerda */}
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white grid place-items-center shrink-0">
              {(profile?.name ?? profile?.preferred_username ?? 'U').slice(0, 1).toUpperCase()}
            </div>

            {/* Nome à direita do avatar */}
            <div className="leading-tight hidden sm:block max-w-[160px] text-left">
              <div className="text-sm font-medium truncate">
                {profile?.name ?? profile?.preferred_username ?? 'User'}
              </div>
              <div className="text-xs text-muted-foreground">Shop Admin</div>
            </div>

            {/* Kebab / Logout */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0"
              aria-label="More"
              onClick={logout}
              title="Logout"
            >
              ⋯
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Topbar;
