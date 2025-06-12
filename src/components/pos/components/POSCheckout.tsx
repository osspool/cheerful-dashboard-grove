
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Receipt, CreditCard, DollarSign } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface POSCheckoutProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const POSCheckout = ({ onComplete, onCancel }: POSCheckoutProps) => {
  const { state } = usePOS();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.cartItems.reduce((sum, item) => sum + item.sellingPrice, 0);
  const total = subtotal;
  const cashReceived = parseFloat(cashAmount) || 0;
  const change = cashReceived - total;

  const handleCompleteCheckout = async () => {
    if (paymentMethod === 'cash' && cashReceived < total) {
      toast({
        title: "Insufficient Payment",
        description: "Cash received is less than the total amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const saleData = {
        id: `SALE-${Date.now()}`,
        items: state.cartItems,
        subtotal,
        total,
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceived : total,
        change: paymentMethod === 'cash' ? change : 0,
        customerNotes,
        createdAt: new Date().toISOString(),
        status: 'completed' as const,
      };

      console.log('Sale completed:', saleData);

      toast({
        title: "Sale Completed",
        description: `Sale ${saleData.id} completed successfully.`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Sale Failed",
        description: "Failed to complete the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Complete Sale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="space-y-2">
          <h4 className="font-medium">Order Summary</h4>
          <div className="text-sm space-y-1">
            {state.cartItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="truncate">{item.inventoryItem.product.title}</span>
                <span>{formatCurrency(item.sellingPrice)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'mixed') => setPaymentMethod(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cash
                </div>
              </SelectItem>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card
                </div>
              </SelectItem>
              <SelectItem value="mixed">Mixed Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cash Payment */}
        {paymentMethod === 'cash' && (
          <div className="space-y-2">
            <Label htmlFor="cash-amount">Cash Received</Label>
            <Input
              id="cash-amount"
              type="number"
              step="0.01"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder="0.00"
            />
            {cashReceived > 0 && (
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Received:</span>
                  <span>{formatCurrency(cashReceived)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Change:</span>
                  <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(Math.max(0, change))}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Notes */}
        <div className="space-y-2">
          <Label htmlFor="customer-notes">Customer Notes (Optional)</Label>
          <Textarea
            id="customer-notes"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Any special notes about this sale..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteCheckout}
            disabled={isProcessing || (paymentMethod === 'cash' && cashReceived < total)}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : 'Complete Sale'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
