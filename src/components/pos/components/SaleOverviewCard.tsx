
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { POSSale } from '../types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface SaleOverviewCardProps {
  sale: POSSale;
}

const getStatusColor = (status: POSSale['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'partial': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const SaleOverviewCard = ({ sale }: SaleOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sale Overview</CardTitle>
          <Badge className={getStatusColor(sale.status)}>
            {sale.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Sale ID:</span>
            <p className="font-mono">{sale.id}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>
            <p className="font-semibold">{formatCurrency(sale.total)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date:</span>
            <p>{format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Payment:</span>
            <p className="capitalize">{sale.paymentMethod || 'Not specified'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
