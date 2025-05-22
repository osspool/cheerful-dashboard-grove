
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { Variant } from '@/components/inventory-drawer/types';
import { generatePriceHistoryData, mockSalesHistory } from './marketData/marketDataUtils';
import { SalesChart } from './marketData/SalesChart';
import { TimeRangeSelector } from './marketData/TimeRangeSelector';
import { MarketDataStats } from './marketData/MarketDataStats';
import { SalesHistory } from './marketData/SalesHistory';

// Generate price history data
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
          <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>
        
        {/* Price Chart */}
        <SalesChart timeRange={timeRange} priceHistoryData={priceHistoryData} />
        
        {/* Current Market Data Stats */}
        <MarketDataStats 
          platform={platform}
          stockXData={stockXData}
          goatData={goatData}
        />
      </div>
      
      {/* Sales History Table */}
      <SalesHistory salesData={salesData} />
    </div>
  );
}
