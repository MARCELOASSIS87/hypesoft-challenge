import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const sections = [
  {
    title: 'General',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/statistics', label: 'Statistics', icon: '📈', disabled: true },
    ],
  },
  {
    title: 'Shop',
    items: [
      { to: '/my-shop', label: 'My Shop', icon: '🏬', disabled: true },
      { to: '/products', label: 'Products', icon: '🧾' },
      { to: '/customers', label: 'Customers', icon: '👤', disabled: true },
      { to: '/invoice', label: 'Invoice', icon: '🧾', disabled: true },
      { to: '/messages', label: 'Messages', icon: '✉️', disabled: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { to: '/settings', label: 'Settings', icon: '⚙️', disabled: true },
      { to: '/help', label: 'Help', icon: '❓', disabled: true },
    ],
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 border-r bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="flex h-full w-full flex-col p-4 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">S</div>
          <div className="font-semibold text-lg">ShopSense</div>
        </div>

        {/* Nav sections */}
        <div className="flex-1 overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.title} className="mt-4">
              <div className="px-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {section.title}
              </div>
              <nav className="grid gap-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'mx-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                        item.disabled
                          ? 'text-muted-foreground/60 pointer-events-none select-none'
                          : isActive
                          ? 'bg-indigo-600/10 text-indigo-700'
                          : 'hover:bg-muted'
                      )
                    }
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.to === '/messages' && (
                      <span className="ml-auto text-xs rounded-full bg-indigo-600 text-white px-2 py-[2px]">4</span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Upsell card */}
        <div className="rounded-xl border p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="font-medium mb-2">Try ShopSense Pro</div>
          <p className="text-xs text-muted-foreground mb-3">
            Get Pro and enjoy 20+ features to enhance your sales. Free 30-day trial.
          </p>
          <Button className="w-full">Upgrade Plan</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
