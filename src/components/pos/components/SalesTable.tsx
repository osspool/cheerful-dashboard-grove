
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Eye, Truck, Package, RotateCcw } from 'lucide-react';
import { POSSale } from '../types';
import { POSSaleManagement } from './POSSaleManagement';
import { calculateSaleProfit } from '../utils/profitCalculations';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface SalesTableProps {
  sales: POSSale[];
}

export const SalesTable = ({ sales }: SalesTableProps) => {
  const [selectedSale, setSelectedSale] = useState<POSSale | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return <Truck className="h-3 w-3" />;
      case 'delivered': return <Package className="h-3 w-3" />;
      case 'returned': return <RotateCcw className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Adjustments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => {
            const saleProfit = calculateSaleProfit(sale);
            return (
              <TableRow key={sale.id}>
                <TableCell className="font-mono">{sale.id}</TableCell>
                <TableCell>
                  {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{sale.items.length}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(sale.total)}
                </TableCell>
                <TableCell className={`font-medium ${saleProfit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(saleProfit.netProfit)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(sale.status)}>
                    {getStatusIcon(sale.status)}
                    {sale.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sale.adjustments && sale.adjustments.length > 0 ? (
                    <Badge variant="outline" className="text-xs">
                      {sale.adjustments.length} adj.
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Sale Management - {selectedSale?.id}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        {selectedSale && (
                          <POSSaleManagement 
                            sale={selectedSale} 
                            onUpdate={() => setIsSheetOpen(false)}
                          />
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {sales.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sales found matching your criteria.
        </div>
      )}
    </>
  );
};
