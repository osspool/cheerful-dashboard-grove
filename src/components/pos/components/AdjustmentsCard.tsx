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
import { POSSale, POSAdjustment } from '../types';
import { useAddSaleAdjustment } from '../hooks/usePOSSales';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdjustmentsCardProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const AdjustmentsCard = ({ sale, onUpdate }: AdjustmentsCardProps) => {
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<POSAdjustment['type']>('price_adjustment');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const addAdjustmentMutation = useAddSaleAdjustment();
  const { toast } = useToast();

  const handleAddAdjustment = async () => {
    try {
      await addAdjustmentMutation.mutateAsync({
        saleId: sale.id,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Price Adjustments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Add Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Price Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={(value: POSAdjustment['type']) => setAdjustmentType(value)}>
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
                disabled={!adjustmentAmount || !adjustmentReason}
                className="w-full"
              >
                Add Adjustment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Adjustments */}
        {sale.adjustments && sale.adjustments.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Applied Adjustments</h4>
            <div className="space-y-2">
              {sale.adjustments.map((adjustment) => (
                <div key={adjustment.id} className="border rounded-md p-3 bg-muted/30">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs">
                      {adjustment.type.replace('_', ' ')}
                    </Badge>
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
            No adjustments applied to this sale
          </div>
        )}
      </CardContent>
    </Card>
  );
};
