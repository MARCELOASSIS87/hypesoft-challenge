import api from './api';

export type Product = {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  sku?: string;
  barcode?: string;
  categoryId: string;
  images?: string[];
  stockQuantity: number;
  stockMin?: number;
  status?: string; // e.g., "active"
};

function normalize(p: Product) {
  return {
    _id: p._id ?? p.id,
    name: p.name,
    price: p.price,
    stockQuantity: p.stockQuantity,
    categoryId: p.categoryId,
  };
}

export async function getProducts() {
  const res = await api.get<Product[]>('/products');
  return (res.data ?? []).map(normalize);
}

export async function createProduct(p: {
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  sku?: string;
  barcode?: string;
  images?: string[];
  stockMin?: number;
  status?: string;
}) {
  const payload: Product = {
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    price: p.price,
    categoryId: p.categoryId,
    stockQuantity: p.stockQuantity,
    sku: p.sku ?? '',
    barcode: p.barcode ?? '',
    images: p.images ?? [],
    stockMin: p.stockMin ?? 0,
    status: p.status ?? 'active',
  };
  const res = await api.post<Product>('/products', payload);
  return normalize(res.data);
}

export async function updateProduct(id: string, p: {
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  sku?: string;
  barcode?: string;
  images?: string[];
  stockMin?: number;
  status?: string;
}) {
  const payload: Product = {
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    price: p.price,
    categoryId: p.categoryId,
    stockQuantity: p.stockQuantity,
    sku: p.sku ?? '',
    barcode: p.barcode ?? '',
    images: p.images ?? [],
    stockMin: p.stockMin ?? 0,
    status: p.status ?? 'active',
  };
  const res = await api.put<Product>(`/products/${id}`, payload);
  return normalize(res.data);
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}
