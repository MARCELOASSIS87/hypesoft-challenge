// src/pages/Products.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/services/products';
import { getCategories } from '@/services/categories';
import { toSlug } from '@/utils/slug';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { useToast } from '@/hooks/useToast';

type UIProduct = {
  _id?: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
};

type FormState = {
  name: string;
  slug: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
};

const emptyForm: FormState = { name: '', slug: '', price: '', stockQuantity: '', categoryId: '' };

const Products: React.FC = () => {
  const [items, setItems] = useState<UIProduct[]>([]);
  const [cats, setCats] = useState<Array<{ _id?: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [products, categories] = await Promise.all([getProducts({ fresh: true }), getCategories()]);
      setItems(products as UIProduct[]);
      setCats(categories);
    } catch (e) {
      setError('Falha ao carregar dados.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!editingId) {
      setForm((f) => ({ ...f, slug: toSlug(f.name) }));
    }
  }, [form.name, editingId]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      name: form.name.trim(),
      slug: (form.slug || toSlug(form.name)).trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId,
      description: '',
      sku: '',
      barcode: '',
      images: [] as string[],
      stockMin: 0,
      status: 'active',
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        show({ title: 'Produto atualizado!', variant: 'success' });
      } else {
        await createProduct(payload);
        show({ title: 'Produto criado!', variant: 'success' });
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError('Falha ao salvar produto.');
      show({ title: 'Erro ao salvar', description: 'Tente novamente', variant: 'error' });
      console.error(err);
    }
  }

  function startEdit(p: UIProduct) {
    setEditingId(p._id!);
    setForm({
      name: p.name,
      slug: toSlug(p.name),
      price: String(p.price),
      stockQuantity: String(p.stockQuantity),
      categoryId: p.categoryId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!confirm('Remover este produto?')) return;
    try {
      await deleteProduct(id);
      show({ title: 'Produto removido', variant: 'success' });
      await load();
    } catch (err) {
      setError('Falha ao remover produto.');
      show({ title: 'Erro ao remover', description: 'Tente novamente', variant: 'error' });
      console.error(err);
    }
  }

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-muted-foreground">Gerencie seus produtos (dados reais do backend).</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? 'Editar produto' : 'Novo produto'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Ex.: Camiseta Preta"
                required
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                readOnly
                onChange={(e) => onChange('slug', e.target.value)}
                placeholder="ex.: camiseta-preta"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => onChange('price', e.target.value)}
                placeholder="Ex.: 49.90"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                value={form.stockQuantity}
                onChange={(e) => onChange('stockQuantity', e.target.value)}
                placeholder="Ex.: 100"
                required
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="h-9 w-full rounded-md border bg-white px-3 text-sm"
                value={form.categoryId}
                onChange={(e) => onChange('categoryId', e.target.value)}
                required
              >
                <option value="" disabled>Selecione…</option>
                {cats.map((c, idx) => (
                  <option key={`${c._id ?? c.name}-${idx}`} value={c._id ?? ''}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6 flex gap-2">
              <Button type="submit">{editingId ? 'Salvar alterações' : 'Adicionar'}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-muted-foreground">
              <th className="text-left font-medium p-3">Nome</th>
              <th className="text-left font-medium p-3">Preço</th>
              <th className="text-left font-medium p-3">Estoque</th>
              <th className="text-left font-medium p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-0" colSpan={4}><TableSkeleton rows={3} /></td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={4}>Nenhum produto encontrado.</td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">R$ {p.price.toFixed(2)}</td>
                  <td className="p-3">{p.stockQuantity}</td>
                  <td className="p-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(p)}>Editar</Button>
                    {p._id && (
                      <Button variant="destructive" size="sm" onClick={() => remove(p._id!)}>Remover</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Products;
