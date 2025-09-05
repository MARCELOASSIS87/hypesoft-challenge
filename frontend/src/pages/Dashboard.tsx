// src/pages/Dashboard.tsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import StatCard from "@/components/cards/StatCard";
import ProductsByCategoryChart from "@/components/charts/ProductsByCategoryChart";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';


function currencyBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Dashboard() {
  const { data: products = [], isLoading: loadingP } = useProducts();
  const { data: categories = [], isLoading: loadingC } = useCategories();
  const [query, setQuery] = useState("");

  const {
    totalProducts,
    lowStock,
    chartData,
    filteredActivities,
    filteredLowStock,
  } = useMemo(() => {
    // totais
    const totalProducts = products.length;

    // nomes de categoria resolvidos (para render)
    const getCatName = (p: Product) =>
      p.categoryName ||
      categories.find((c) => c.id === p.categoryId)?.name ||
      "Sem categoria";

    // baixo estoque (<10 conforme README)
    const lowStock = [...products]
      .filter((p) => (p.quantity ?? 0) < 10)
      .sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0));

    // gráfico por categoria
    const counter = new Map<string, number>();
    products.forEach((p) => {
      const cat = getCatName(p);
      counter.set(cat, (counter.get(cat) || 0) + 1);
    });
    const chartData = Array.from(counter.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    // “Recent Activities” inspirado no mock:
    // usamos os 8 produtos mais recentes pelo nome (sem inventar timestamps).
    const recentActivities = [...products]
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: getCatName(p),
        price: p.price,
        quantity: p.quantity ?? 0,
        badge:
          (p.quantity ?? 0) < 10 ? "Low Stock" : (p.price ?? 0) > 0 ? "Product Update" : "New Product",
      }));
    // normaliza a busca uma única vez
    const q = query.trim().toLowerCase();
    // filtro de search para a coluna direita
    const filteredLowStock = lowStock.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    // filtro de search para Recent Activities (nome OU categoria)
    const filteredActivities = recentActivities.filter(
      (a) => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );

    return {
      totalProducts,
      lowStock,
      chartData,
      recentActivities,
      filteredLowStock,
      filteredActivities
    };
  }, [products, categories, query]);

  if (loadingP || loadingC) {
    return <AppLayout><DashboardSkeleton /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header + Tabs (estético, seguindo o protótipo do README) */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button className="rounded-full bg-violet-600/10 px-3 py-1 font-medium text-violet-700 dark:text-violet-300">
              Overview
            </button>
            <button className="rounded-full px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Product List
            </button>
            <button className="rounded-full px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Inventory Management
            </button>
            <button className="rounded-full px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Sales Performance
            </button>
            <button className="rounded-full px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Marketing
            </button>
            <button className="rounded-full px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Customer Feedback
            </button>
          </div>
        </div>

        {/* Cards no topo */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Products" value={totalProducts} helper="+variação mensal (mock)" />
          <StatCard title="Average Rating" value="4.8" helper="+0.2 (mock)" />
          <StatCard title="Sales Trends" value="↑" helper="último mês (mock)" />
          <StatCard title="Low Stock" value={lowStock.length} helper="products < 10 units" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Centro: gráfico e atividades, ocupando 2 colunas */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="mb-2 text-sm font-medium text-gray-600">
                Products by category
              </h2>
              <ProductsByCategoryChart data={chartData} />
            </div>

            {/* Recent Activities (lista grande ao estilo do mock) */}
            <div className="rounded-2xl border border-gray-200/50 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between p-4">
                <div className="text-base font-semibold">Recent Activities</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search"
                      className="pl-8 w-48"
                    />
                  </div>
                  <Button variant="outline" className="hidden md:inline-flex">
                    Filter
                  </Button>
                  <Button variant="outline" className="hidden md:inline-flex">
                    Show
                  </Button>
                  <Button variant="outline" className="hidden md:inline-flex">
                    Date
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-200/60 dark:divide-zinc-800">
                <div className="grid grid-cols-12 px-4 py-2 text-xs text-gray-500">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Activity Type</div>
                  <div className="col-span-4">Details</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                {filteredActivities.length === 0 && (
                  <div className="px-4 py-6 text-sm text-gray-500">Nenhuma atividade encontrada.</div>
                )}
                {filteredActivities.map((a) => (
                  <div key={a.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{a.name}</div>
                        <div className="truncate text-xs text-gray-500">{a.category}</div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${a.badge === "Low Stock"
                          ? "bg-rose-100 text-rose-700"
                          : a.badge === "Product Update"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                          }`}
                      >
                        {a.badge}
                      </span>
                    </div>
                    <div className="col-span-4 text-gray-600 dark:text-gray-300">
                      {`Price: ${currencyBRL(a.price ?? 0)} | Stock: ${a.quantity}`}
                    </div>
                    <div className="col-span-2 text-right">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direita: Low Stock (coluna com busca no topo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-600">Low Stock</h2>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                {lowStock.length} itens
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200/50 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search product"
                  className="pl-8"
                />
              </div>

              <ul className="divide-y divide-gray-200/60 dark:divide-zinc-800">
                {filteredLowStock.length === 0 && (
                  <li className="p-3 text-sm text-gray-500">
                    No low stock items.
                  </li>
                )}
                {filteredLowStock.slice(0, 8).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="truncate text-xs text-gray-500">
                        {p.categoryName ?? "Sem categoria"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{p.quantity ?? 0} un.</div>
                      <div className="text-xs text-gray-500">{currencyBRL(p.price || 0)}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-right">
                <Button size="sm" variant="outline">View all</Button>
              </div>
            </div>
          </div>
        </section>
      </div >
    </AppLayout >
  );
}
