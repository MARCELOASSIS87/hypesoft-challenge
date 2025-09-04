// src/types/product.ts
export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;           // valor unitário
  quantity: number;        // quantidade em estoque
  categoryId?: string | null;
  categoryName?: string;   // ajuda a renderizar rápido se vier populado
};
