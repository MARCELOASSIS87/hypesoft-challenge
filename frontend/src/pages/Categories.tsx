import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const Categories: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground">CRUD de categorias (integração no próximo passo).</p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        Em breve: listagem e criação/edição de categorias.
      </div>
    </AppLayout>
  );
};

export default Categories;
