// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import  api  from "@/services/api"; // sua instância HTTP
import type { Product, Category } from "@/types/product";

/**
 * Normaliza o produto vindo do backend para o tipo Product usado no front.
 * - id: _id | id
 * - quantity: stockQuantity | quantity | 0
 * - categoryId: categoryId | category?._id
 * - categoryName: category?.name | categoryName
 */
function normalizeProduct(raw: any): Product {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    description: raw.description,
    price: Number(raw.price ?? 0),
    // 👇 aqui estava o bug
    quantity: Number(
      raw.stockQuantity ??        // backend atual
      raw.quantity ??             // fallback se mudar no futuro
      0
    ),
    categoryId: raw.categoryId ?? raw.category?._id ?? null,
    categoryName: raw.category?.name ?? raw.categoryName,
  };
}

/**
 * Normaliza categoria (id pode vir como _id).
 */
function normalizeCategory(raw: any): Category {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
  };
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      // garante array e normaliza
      const list = Array.isArray(data) ? data : [];
      return list.map(normalizeProduct);
    },
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      const list = Array.isArray(data) ? data : [];
      return list.map(normalizeCategory);
    },
    staleTime: 5 * 60_000,
  });
}
