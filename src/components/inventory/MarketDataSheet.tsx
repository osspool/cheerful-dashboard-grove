
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, ArrowDown, CircleDollarSign } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Variant } from '@/components/inventory-drawer/types';

interface SaleHistoryItem {
  date: string;
  time: string;
  size: string;
  price: string;
}

// Mock sales history data
const mockSalesHistory: SaleHistoryItem[] = [
  { date: "Mar 29, 2023", time: "02:05 PM", size: "6.5Y", price: "$189" },
  { date: "Mar 28, 2023", time: "01:22 PM", size: "6.5Y", price: "$192" },
  { date: "Mar 25, 2023", time: "09:00 AM", size: "6.5Y", price: "$205" },
  { date: "Mar 24, 2023", time: "03:47 AM", size: "6.5Y", price: "$200" },
  { date: "Mar 23, 2023", time: "08:08 PM", size: "6.5Y", price: "$188" },
  { date: "Mar 22, 2023", time: "11:30 AM", size: "6.5Y", price: "$195" },
];

// Mock price history data
const generatePriceHistoryData = () => {
  const data = [];
  const today = new Date();
  for (let i = 365; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a price between $180-$220 with some fluctuation
    const basePrice = 200;
    const variance = Math.sin(i/10) * 20;
    const price = Math.round(basePrice + variance + (Math.random() * 10 - 5));
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: price
    });
  }
  return data;
};

const priceHistoryData = generatePriceHistoryData();

interface MarketDataSheetProps {
  stockXData: any;
  goatData: any;
  variant: Variant;
  isLoading: boolean;
}

export function MarketDataSheet({ stockXData, goatData, variant, isLoading }: MarketDataSheetProps) {
  const [timeRange, setTimeRange] = useState('1Y');
  const [platform, setPlatform] = useState('stockx');
  
  // Show StockX or GOAT sales data based on selected platform
  const salesData = platform === 'stockx' ? mockSalesHistory : mockSalesHistory;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform selection */}
      <Tabs value={platform} onValueChange={setPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stockx">StockX</TabsTrigger>
          <TabsTrigger value="goat">GOAT</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Price Chart Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Sales</h3>
          <div className="flex bg-secondary/20 rounded-md">
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '1D' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('1D')}
            >
              1D
            </button>
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '1W' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('1W')}
            >
              1W
            </button>
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '1M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('1M')}
            >
              1M
            </button>
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '3M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('3M')}
            >
              3M
            </button>
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '6M' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('6M')}
            >
              6M
            </button>
            <button 
              className={`px-3 py-1 text-xs ${timeRange === '1Y' ? 'bg-primary text-primary-foreground rounded-md' : ''}`}
              onClick={() => setTimeRange('1Y')}
            >
              1Y
            </button>
          </div>
        </div>
        
        {/* Price Chart */}
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
        
        {/* Current Market Data Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-3 bg-secondary/10">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <ArrowDown className="h-4 w-4 text-primary" />
              Lowest Ask
            </div>
            <div className="text-xl font-semibold">
              {platform === 'stockx' 
                ? stockXData?.lowestAskAmount ? `$${stockXData.lowestAskAmount}` : '$--' 
                : goatData && goatData[0] ? formatCurrency(goatData[0].availability.lowest_listing_price_cents) : '$--'}
            </div>
          </div>
          <div className="border rounded-md p-3 bg-secondary/10">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <CircleDollarSign className="h-4 w-4 text-green-500" />
              Highest Bid
            </div>
            <div className="text-xl font-semibold">
              {platform === 'stockx' 
                ? stockXData?.highestBidAmount ? `$${stockXData.highestBidAmount}` : '$--' 
                : goatData && goatData[0] ? formatCurrency(goatData[0].availability.highest_offer_price_cents) : '$--'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales History Table */}
      <div>
        <div className="mb-2">
          <h3 className="text-lg font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Sales History
          </h3>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm">{sale.date}</TableCell>
                  <TableCell className="text-sm">{sale.time}</TableCell>
                  <TableCell className="text-sm">{sale.size}</TableCell>
                  <TableCell className="text-right font-medium">{sale.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="bg-secondary/10 p-2 text-center">
            <button className="text-primary text-sm hover:underline">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
