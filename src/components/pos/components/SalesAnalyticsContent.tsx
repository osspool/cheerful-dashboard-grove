
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Receipt,
  Target,
  Package,
  Award
} from 'lucide-react';
import { usePOSSales } from '../hooks/usePOSSales';
import { 
  calculatePeriodMetrics, 
  calculateSaleProfit, 
  getTopPerformingItems,
  ProfitMetrics 
} from '../utils/profitCalculations';
import { formatCurrency } from '@/lib/utils';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export const SalesAnalyticsContent = () => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const dateRange = useMemo(() => ({
    from: startOfDay(new Date(startDate)),
    to: endOfDay(new Date(endDate))
  }), [startDate, endDate]);
  
  const { data: allSales, isLoading } = usePOSSales(dateRange);
  
  const analytics = useMemo(() => {
    if (!allSales?.length) return null;
    
    const metrics = calculatePeriodMetrics(allSales);
    const saleProfits = allSales.map(calculateSaleProfit);
    const topItems = getTopPerformingItems(allSales);
    
    // Group by status for status analysis
    const statusBreakdown = allSales.reduce((acc, sale) => {
      const profit = calculateSaleProfit(sale);
      acc[sale.status] = acc[sale.status] || { count: 0, revenue: 0, profit: 0 };
      acc[sale.status].count += 1;
      acc[sale.status].revenue += profit.revenue;
      acc[sale.status].profit += profit.netProfit;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; profit: number }>);
    
    return {
      metrics,
      saleProfits,
      topItems,
      statusBreakdown,
    };
  }, [allSales]);

  const getProfitColor = (margin: number) => {
    if (margin >= 30) return 'text-green-600';
    if (margin >= 15) return 'text-blue-600';
    if (margin >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitIcon = (margin: number) => {
    return margin >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          No sales data available for the selected period.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button variant="outline">
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(analytics.metrics.totalRevenue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Net Profit</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(analytics.metrics.netProfit)}</p>
            <div className={`flex items-center gap-1 text-sm ${getProfitColor(analytics.metrics.netProfitMargin)}`}>
              {getProfitIcon(analytics.metrics.netProfitMargin)}
              {analytics.metrics.netProfitMargin.toFixed(1)}% margin
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Sales</span>
            </div>
            <p className="text-2xl font-bold">{allSales?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Adjustments</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(analytics.metrics.adjustmentsTotal)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Details</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="status">Status Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Profit Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Gross Profit</div>
                  <div className="text-xl font-semibold">{formatCurrency(analytics.metrics.grossProfit)}</div>
                  <div className="text-sm text-muted-foreground">
                    {analytics.metrics.profitMargin.toFixed(1)}% margin
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Adjustments Impact</div>
                  <div className={`text-xl font-semibold ${analytics.metrics.adjustmentsTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.metrics.adjustmentsTotal >= 0 ? '+' : ''}{formatCurrency(analytics.metrics.adjustmentsTotal)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Net Profit</div>
                  <div className={`text-xl font-semibold ${getProfitColor(analytics.metrics.netProfitMargin)}`}>
                    {formatCurrency(analytics.metrics.netProfit)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analytics.metrics.netProfitMargin.toFixed(1)}% margin
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Sale Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Adjustments</TableHead>
                    <TableHead>Net Profit</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.saleProfits.map((saleProfit) => (
                    <TableRow key={saleProfit.saleId}>
                      <TableCell className="font-mono">{saleProfit.saleId}</TableCell>
                      <TableCell>
                        {format(new Date(saleProfit.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{formatCurrency(saleProfit.revenue)}</TableCell>
                      <TableCell>{formatCurrency(saleProfit.cost)}</TableCell>
                      <TableCell className={saleProfit.adjustments >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {saleProfit.adjustments >= 0 ? '+' : ''}{formatCurrency(saleProfit.adjustments)}
                      </TableCell>
                      <TableCell className={`font-medium ${getProfitColor(saleProfit.profitMargin)}`}>
                        {formatCurrency(saleProfit.netProfit)}
                      </TableCell>
                      <TableCell className={getProfitColor(saleProfit.profitMargin)}>
                        <div className="flex items-center gap-1">
                          {getProfitIcon(saleProfit.profitMargin)}
                          {saleProfit.profitMargin.toFixed(1)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Avg Profit/Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topItems.map((item, index) => (
                    <TableRow key={item.productTitle}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          {item.productTitle}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.revenue)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.profit)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.profit / item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Avg Profit/Sale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(analytics.statusBreakdown).map(([status, data]) => (
                    <TableRow key={status}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{data.count}</TableCell>
                      <TableCell>{formatCurrency(data.revenue)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(data.profit)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(data.profit / data.count)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
