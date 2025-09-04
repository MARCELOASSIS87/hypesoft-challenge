import api from './api';

export type Category = {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
};

function normalize(c: Category) {
  return {
    _id: c._id ?? c.id,
    name: c.name,
    slug: c.slug,
  };
}

export async function getCategories() {
  const res = await api.get<Category[]>('/categories');
  return (res.data ?? []).map(normalize);
}

export async function createCategory(category: { name: string; slug: string; description?: string; isActive?: boolean }) {
  const payload: Category = {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    isActive: category.isActive ?? true,
  };
  const res = await api.post<Category>('/categories', payload);
  return normalize(res.data);
}

export async function updateCategory(id: string, category: { name: string; slug: string; description?: string; isActive?: boolean }) {
  const payload: Category = {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    isActive: category.isActive ?? true,
  };
  const res = await api.put<Category>(`/categories/${id}`, payload);
  return normalize(res.data);
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}
