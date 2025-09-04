// src/components/charts/ProductsByCategoryChart.tsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DataItem = { category: string; count: number };

export default function ProductsByCategoryChart({ data }: { data: DataItem[] }) {
  return (
    <div className="h-80 rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
