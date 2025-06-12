import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Edit } from 'lucide-react';
import { POSSale, POSItemAdjustment } from '../types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdjustmentsCardProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const AdjustmentsCard = ({ sale, onUpdate }: AdjustmentsCardProps) => {
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(sale.items[0]?.id || '');
  const [adjustmentType, setAdjustmentType] = useState<POSItemAdjustment['type']>('price_adjustment');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const { toast } = useToast();

  const handleAddAdjustment = async () => {
    try {
      // In a real app, this would call an API to add the adjustment to the specific item
      console.log('Adding adjustment to item:', selectedItemId, {
        type: adjustmentType,
        amount: parseFloat(adjustmentAmount),
        reason: adjustmentReason,
      });

      toast({
        title: "Adjustment Added",
        description: `${adjustmentType.replace('_', ' ')} of ${formatCurrency(parseFloat(adjustmentAmount))} added`,
      });

      setIsAdjustmentDialogOpen(false);
      setAdjustmentAmount('');
      setAdjustmentReason('');
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add adjustment",
        variant: "destructive",
      });
    }
  };

  // Get all adjustments from all items in the sale
  const allAdjustments = sale.items.flatMap(item => 
    (item.adjustments || []).map(adj => ({
      ...adj,
      itemTitle: item.inventoryItem.product.title
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Item Adjustments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Add Item Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Item</Label>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sale.items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.inventoryItem.product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={(value: POSItemAdjustment['type']) => setAdjustmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_adjustment">Price Adjustment</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleAddAdjustment}
                disabled={!adjustmentAmount || !adjustmentReason || !selectedItemId}
                className="w-full"
              >
                Add Adjustment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Adjustments */}
        {allAdjustments.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Applied Adjustments</h4>
            <div className="space-y-2">
              {allAdjustments.map((adjustment) => (
                <div key={adjustment.id} className="border rounded-md p-3 bg-muted/30">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs w-fit">
                        {adjustment.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{adjustment.itemTitle}</span>
                    </div>
                    <span className="font-semibold">
                      {adjustment.amount >= 0 ? '+' : ''}{formatCurrency(adjustment.amount)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{adjustment.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(adjustment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No adjustments applied to any items in this sale
          </div>
        )}
      </CardContent>
    </Card>
  );
};
