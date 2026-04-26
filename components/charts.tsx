"use client";

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ContributionTrendChart({
  data,
}: {
  data: Array<{ month: string; total: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: "rgba(13, 107, 62, 0.08)" }} />
        <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#0d6b3e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AidBreakdownChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const palette = ["#0d6b3e", "#f3c44d", "#d24a43", "#3a8d62", "#204830", "#c89118"];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip />
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={58} outerRadius={88}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={palette[index % palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
