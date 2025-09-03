import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mini sparkline simples em SVG
const Sparkline: React.FC<{ points?: number[] }> = ({ points = [10, 12, 8, 14, 13, 18, 16] }) => {
  const path = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${i * 20} ${40 - y}`)
    .join(' ');
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10">
      <path d={path} fill="none" stroke="currentColor" className="text-indigo-600" strokeWidth="2" />
    </svg>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; hint?: string; icon?: string; children?: React.ReactNode }> = ({
  title,
  value,
  hint,
  icon = '📦',
  children,
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <span className="text-lg">{icon}</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      {children}
    </CardContent>
  </Card>
);

const tags = [
  { label: 'Stock Adjustment', color: 'bg-blue-100 text-blue-700' },
  { label: 'New Product', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Customer Review', color: 'bg-amber-100 text-amber-700' },
  { label: 'Product Update', color: 'bg-purple-100 text-purple-700' },
  { label: 'Promotion', color: 'bg-pink-100 text-pink-700' },
  { label: 'Deletion', color: 'bg-rose-100 text-rose-700' },
];

const activities = Array.from({ length: 10 }).map((_, i) => ({
  product: ['Linen Shirt', 'Jeans Jacket', 'Ankle Pants', 'Black T-Shirt', 'Slim Fit Jeans'][i % 5],
  tag: tags[i % tags.length],
  details:
    [
      'Stock adjusted from 100 to 90 units after bulk order.',
      'Price: $65.00. Stock: 70 units.',
      '“Great quality and fit.” Rating: 5 stars.',
      'Price updated to $55.00. Stock: 80 units.',
      '10% off summer sale. Duration: Jun 27 – Jul 15, 2024',
      'Discontinued due to low sales. Stock: 0 units.',
      'Lightweight and breathable. Price: $45.00. Stock: 100 units.',
      'Stock increased from 40 to 60 units after restock.',
    ][i % 8],
  date: ['June 29, 2024', 'June 28, 2024', 'June 27, 2024', 'June 26, 2024'][i % 4],
}));

const Dashboard: React.FC = () => {
  return (
    <AppLayout>
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={586} hint="+5 products · from last month" icon="📦" />
        <StatCard title="Average Rating" value={4.8} hint="+0.2 · from last month" icon="⭐" />
        <StatCard title="Sales Trends" value="" icon="📈">
          <Sparkline />
        </StatCard>
        <StatCard title="Low Stock" value={5} hint="are under 50 items" icon="⚠️" />
      </div>

      {/* Recent activities header */}
      <div className="mt-6 flex items-center gap-2">
        <div className="text-sm font-medium">Recent Activities</div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <input
              placeholder="Search"
              className="h-9 w-52 rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">🔎</span>
          </div>
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">$</Button>
          <Button variant="outline" size="sm">⋯</Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-muted-foreground">
              <th className="text-left font-medium p-3">Product</th>
              <th className="text-left font-medium p-3">Activity Type</th>
              <th className="text-left font-medium p-3">Details</th>
              <th className="text-left font-medium p-3">Date</th>
              <th className="text-left font-medium p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-neutral-200" />
                    <div className="font-medium">{row.product}</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${row.tag.color}`}>{row.tag.label}</span>
                </td>
                <td className="p-3 text-muted-foreground">{row.details}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">
                  <button className="text-indigo-700 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
