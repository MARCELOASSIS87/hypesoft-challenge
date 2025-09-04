// src/components/forms/ProductForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  // Mantemos string no form; validamos e convertemos apenas no submit do pai
  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((v) => !Number.isNaN(Number((v ?? "").replace(",", "."))), "Preço inválido"),
  quantity: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine((v) => /^\d+$/.test(String(v ?? "")), "Quantidade inválida"),
  categoryId: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof schema>;

type Props = {
  categories: { id: string; name: string }[];
  submitLabel?: string;
  initial?: Product | null;
  onSubmit: (data: ProductFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export default function ProductForm({
  categories,
  submitLabel = "Salvar",
  initial,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
    },
  });

  // Preenche formulário no modo edição
  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name ?? "",
        description: initial.description ?? "",
        price: String(initial.price ?? ""),
        quantity: String(initial.quantity ?? ""),
        categoryId: initial.categoryId ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
      });
    }
  }, [initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Ex.: Camiseta básica" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Preço (BRL)</Label>
        <Input id="price" placeholder="Ex.: 49.90" {...register("price")} />
        {errors.price && (
          <p className="mt-1 text-xs text-rose-600">{errors.price.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="quantity">Quantidade</Label>
        <Input id="quantity" placeholder="Ex.: 100" {...register("quantity")} />
        {errors.quantity && (
          <p className="mt-1 text-xs text-rose-600">{errors.quantity.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <select
          id="categoryId"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("categoryId")}
        >
          <option value="">— selecione —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-rose-600">{errors.categoryId.message as string}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Opcional" {...register("description")} />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-600">{errors.description.message as string}</p>
        )}
      </div>

      <div className="md:col-span-2 flex items-center gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
