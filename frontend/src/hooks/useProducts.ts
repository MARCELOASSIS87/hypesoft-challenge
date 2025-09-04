// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api"; // ← unificado aqui
import type { Product, Category } from "@/types/product";

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await api.get<Product[]>("/products");
            return data;
        },
        staleTime: 60_000,
    });
}

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<Category[]>("/categories");
            return data;
        },
        staleTime: 5 * 60_000,
    });
}
