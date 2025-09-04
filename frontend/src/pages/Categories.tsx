// src/pages/Categories.tsx
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/services/categories';
import { toSlug } from '@/utils/slug';

type UIItem = { _id?: string; name: string; slug?: string };

const Categories: React.FC = () => {
  const [items, setItems] = useState<UIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState<UIItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setItems(data);
    } catch (e) {
      setError('Falha ao carregar categorias.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!editing) setSlug(toSlug(name));
  }, [name, editing]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const nm = name.trim();
      const sl = slug.trim() || toSlug(nm);
      if (!nm) return;

      if (editing?._id) {
        await updateCategory(editing._id, {
          name: nm,
          slug: sl,
          isActive: true,
        });
      } else {
        await createCategory({
          name: nm,
          slug: sl,
          isActive: true,
        });
      }
      setName('');
      setSlug('');
      setEditing(null);
      await load();
    } catch (err) {
      setError('Falha ao salvar categoria.');
      console.error(err);
    }
  }

  function startEdit(c: UIItem) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug ?? toSlug(c.name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm('Remover esta categoria?')) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError('Falha ao remover categoria.');
      console.error(err);
    }
  }

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground">Gerencie categorias reais do backend.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editing ? 'Editar categoria' : 'Nova categoria'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Camisas"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex.: camisas"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">{editing ? 'Salvar' : 'Adicionar'}</Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                    setName('');
                    setSlug('');
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
              <th className="text-left font-medium p-3">Slug</th>
              <th className="text-left font-medium p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={3}>Carregando…</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={3}>Nenhuma categoria encontrada.</td>
              </tr>
            ) : (
              items.map((c, idx) => (
                <tr key={`${c._id ?? c.slug ?? c.name}-${idx}`} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.slug ?? toSlug(c.name)}</td>
                  <td className="p-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(c)}>Editar</Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(c._id)}
                      disabled={!c._id}
                      title={!c._id ? 'Sem id para remover' : 'Remover'}
                    >
                      Remover
                    </Button>
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

export default Categories;
