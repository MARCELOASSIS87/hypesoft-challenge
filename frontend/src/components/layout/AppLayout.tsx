import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-[1600px] px-3 lg:px-6 py-6">
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Topbar />
              <main className="p-4 lg:p-6">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
