import { useContext } from "react";
import { ToastCtx } from "@/context/toast-context";

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
