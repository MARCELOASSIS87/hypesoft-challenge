import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import AuthProvider from '@/context/AuthProvider';
import ProtectedRoute from '@/routes/ProtectedRoute';
import WithRoles from '@/routes/WithRoles';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';

function Private({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <Login /> },

  // Área autenticada
  { path: '/dashboard', element: <Private><Dashboard /></Private> },
  { path: '/products', element: <Private><WithRoles roles={['Admin', 'Manager']}><Products /></WithRoles></Private> },
  { path: '/categories', element: <Private><WithRoles roles={['Admin']}><Categories /></WithRoles></Private> },

  // placeholders do sidebar (desabilitados)
  { path: '/statistics', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/my-shop', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/customers', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/invoice', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/messages', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/settings', element: <Private><div className="p-6">Soon</div></Private> },
  { path: '/help', element: <Private><div className="p-6">Soon</div></Private> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
