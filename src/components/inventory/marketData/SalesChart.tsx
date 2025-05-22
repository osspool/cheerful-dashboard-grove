
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface SalesChartProps {
  timeRange: string;
  priceHistoryData: Array<{ date: string; price: number }>;
}

export function SalesChart({ timeRange, priceHistoryData }: SalesChartProps) {
  return (
    <div className="h-64 border rounded-lg bg-card/50 p-4">
      <ChartContainer 
        config={{
          primary: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
          tooltip: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
          grid: { theme: { light: "#e2e8f0", dark: "#334155" } }
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={priceHistoryData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${value}`}
              axisLine={false}
              tickLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
