
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePOSSales } from '../hooks/usePOSSales';
import { calculateSaleProfit } from '../utils/profitCalculations';
import { format } from 'date-fns';
import { SalesSummaryCards } from './SalesSummaryCards';
import { SalesStatusOverview } from './SalesStatusOverview';
import { SalesFilters } from './SalesFilters';
import { SalesTable } from './SalesTable';

export const POSSalesHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { data: sales, isLoading } = usePOSSales();

  const filteredSales = sales?.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || format(new Date(sale.createdAt), 'yyyy-MM-dd') === selectedDate;
    return matchesSearch && matchesDate;
  }) || [];

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const avgSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;
  
  // Calculate total profit
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const profit = calculateSaleProfit(sale);
    return sum + profit.netProfit;
  }, 0);

  // Status summary
  const statusCounts = filteredSales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SalesSummaryCards
        totalSales={filteredSales.length}
        totalRevenue={totalSales}
        totalProfit={totalProfit}
        avgSale={avgSale}
        pendingShipments={statusCounts.confirmed || 0}
      />

      <SalesStatusOverview statusCounts={statusCounts} />

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <SalesTable sales={filteredSales} />
        </CardContent>
      </Card>
    </div>
  );
};
