
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Truck, Package, RotateCcw } from 'lucide-react';
import { POSSale } from '../types';
import { calculateSaleProfit } from '../utils/profitCalculations';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface SalesTableRowProps {
  sale: POSSale;
  onViewSale: (sale: POSSale) => void;
}

export const SalesTableRow = ({ sale, onViewSale }: SalesTableRowProps) => {
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

  const saleProfit = calculateSaleProfit(sale);

  // Derive the actual sale status from individual items
  const getDerivedSaleStatus = (sale: POSSale) => {
    if (sale.items.length === 0) return sale.status;
    
    const statuses = sale.items.map(item => item.status);
    const uniqueStatuses = [...new Set(statuses)];
    
    // If all items have the same status, use that
    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0];
    }
    
    // If items have different statuses, determine overall status
    if (statuses.includes('cancelled')) return 'cancelled';
    if (statuses.includes('returned')) return 'partial';
    if (statuses.every(s => s === 'delivered')) return 'completed';
    if (statuses.includes('delivered')) return 'partial';
    if (statuses.includes('shipped')) return 'partial';
    if (statuses.includes('confirmed')) return 'partial';
    
    return 'pending';
  };

  const derivedStatus = getDerivedSaleStatus(sale);
  const itemStatusSummary = sale.items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <TableRow>
      <TableCell className="font-mono">{sale.id}</TableCell>
      <TableCell>
        {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{sale.items.length}</span>
          <div className="flex gap-1 mt-1">
            {Object.entries(itemStatusSummary).map(([status, count]) => (
              <Badge key={status} className={`${getStatusColor(status)} text-xs`}>
                {count}
              </Badge>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(sale.total)}
      </TableCell>
      <TableCell className={`font-medium ${saleProfit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {formatCurrency(saleProfit.netProfit)}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(derivedStatus)}>
          {getStatusIcon(derivedStatus)}
          {derivedStatus === 'partial' ? 'Partial' : derivedStatus.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        {sale.items.some(item => item.adjustments && item.adjustments.length > 0) ? (
          <Badge variant="outline" className="text-xs">
            {sale.items.reduce((total, item) => total + (item.adjustments?.length || 0), 0)} adj.
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewSale(sale)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
