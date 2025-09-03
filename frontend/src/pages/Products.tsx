import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const Products: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-muted-foreground">CRUD de produtos (integração no próximo passo).</p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        Em breve: listagem, busca, criação e edição.
      </div>
    </AppLayout>
  );
};

export default Products;
