import { createContext } from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  durationMs?: number;
};

export type ToastAPI = {
  show: (t: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
};

export const ToastCtx = createContext<ToastAPI | null>(null);
