
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, FileText, BarChart3, Calendar, Truck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SalesSummaryCardsProps {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  avgSale: number;
  pendingShipments: number;
}

export const SalesSummaryCards = ({
  totalSales,
  totalRevenue,
  totalProfit,
  avgSale,
  pendingShipments
}: SalesSummaryCardsProps) => {
  return (
    <>
      {/* Analytics Link */}
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link to="/sales-analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Detailed Analytics
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Sales</span>
            </div>
            <p className="text-2xl font-bold">{totalSales}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Profit</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Sale</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgSale)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pending Ship</span>
            </div>
            <p className="text-2xl font-bold">{pendingShipments}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
