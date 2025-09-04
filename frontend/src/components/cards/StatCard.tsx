// src/components/cards/StatCard.tsx
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: ReactNode;
  helper?: string;
};

export default function StatCard({ title, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200/20 bg-white/5 p-4 shadow-sm backdrop-blur-sm dark:bg-zinc-900/40">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {helper && <div className="mt-1 text-xs text-gray-500">{helper}</div>}
    </div>
  );
}
