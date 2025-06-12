
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { POSSale } from '../types';
import { SaleOverviewCard } from './SaleOverviewCard';
import { CustomerNotesCard } from './CustomerNotesCard';
import { SaleItemManagement } from './SaleItemManagement';

interface POSSaleManagementProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const POSSaleManagement = ({ sale, onUpdate }: POSSaleManagementProps) => {
  const handleItemUpdate = (itemId: string, updates: any) => {
    console.log('Updating item:', itemId, updates);
    // In a real app, this would call an API to update the specific item
    onUpdate?.();
  };

  const handleItemAdjustment = (itemId: string, adjustment: any) => {
    console.log('Adding adjustment to item:', itemId, adjustment);
    // In a real app, this would call an API to add the adjustment to the specific item
    onUpdate?.();
  };

  return (
    <div className="space-y-6">
      <SaleOverviewCard sale={sale} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sale Items ({sale.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sale.items.map((item) => (
              <SaleItemManagement
                key={item.id}
                item={item}
                onItemUpdate={handleItemUpdate}
                onItemAdjustment={handleItemAdjustment}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <CustomerNotesCard sale={sale} />
    </div>
  );
};
