
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Package, Check, RotateCcw, DollarSign, Edit } from 'lucide-react';
import { POSSale, POSAdjustment } from '../types';
import { useUpdateSaleStatus, useAddSaleAdjustment } from '../hooks/usePOSSales';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface POSSaleManagementProps {
  sale: POSSale;
}

export const POSSaleManagement = ({ sale }: POSSaleManagementProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<POSAdjustment['type']>('price_adjustment');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const updateStatusMutation = useUpdateSaleStatus();
  const addAdjustmentMutation = useAddSaleAdjustment();
  const { toast } = useToast();

  const getStatusColor = (status: POSSale['status']) => {
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

  const canShip = sale.status === 'confirmed';
  const canMarkDelivered = sale.status === 'shipped';
  const canReturn = ['delivered', 'shipped'].includes(sale.status);

  const handleStatusUpdate = async (newStatus: POSSale['status']) => {
    try {
      const shippingDetails = newStatus === 'shipped' ? {
        trackingNumber,
        carrier,
        shippedAt: new Date().toISOString(),
      } : newStatus === 'delivered' ? {
        ...sale.shippingDetails,
        deliveredAt: new Date().toISOString(),
      } : undefined;

      await updateStatusMutation.mutateAsync({
        saleId: sale.id,
        status: newStatus,
        shippingDetails,
      });

      toast({
        title: "Status Updated",
        description: `Sale ${sale.id} marked as ${newStatus}`,
      });

      setIsStatusDialogOpen(false);
      setTrackingNumber('');
      setCarrier('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sale status",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sale Management</CardTitle>
          <Badge className={getStatusColor(sale.status)}>
            {sale.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {canShip && (
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Ship Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ship Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select value={carrier} onValueChange={setCarrier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="usps">USPS</SelectItem>
                        <SelectItem value="dhl">DHL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={!trackingNumber || !carrier}
                    className="w-full"
                  >
                    Mark as Shipped
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {canMarkDelivered && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusUpdate('delivered')}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Mark Delivered
            </Button>
          )}

          {canReturn && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusUpdate('returned')}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Process Return
            </Button>
          )}

          <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
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
        </div>

        {/* Shipping Details */}
        {sale.shippingDetails && (
          <div className="space-y-2">
            <h4 className="font-medium">Shipping Details</h4>
            <div className="text-sm space-y-1">
              {sale.shippingDetails.trackingNumber && (
                <div className="flex justify-between">
                  <span>Tracking:</span>
                  <span className="font-mono">{sale.shippingDetails.trackingNumber}</span>
                </div>
              )}
              {sale.shippingDetails.carrier && (
                <div className="flex justify-between">
                  <span>Carrier:</span>
                  <span>{sale.shippingDetails.carrier.toUpperCase()}</span>
                </div>
              )}
              {sale.shippingDetails.shippedAt && (
                <div className="flex justify-between">
                  <span>Shipped:</span>
                  <span>{new Date(sale.shippingDetails.shippedAt).toLocaleDateString()}</span>
                </div>
              )}
              {sale.shippingDetails.deliveredAt && (
                <div className="flex justify-between">
                  <span>Delivered:</span>
                  <span>{new Date(sale.shippingDetails.deliveredAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adjustments */}
        {sale.adjustments && sale.adjustments.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Adjustments</h4>
            <div className="space-y-1">
              {sale.adjustments.map((adjustment) => (
                <div key={adjustment.id} className="flex justify-between text-sm">
                  <span>{adjustment.type.replace('_', ' ')}:</span>
                  <span className="flex items-center gap-2">
                    {formatCurrency(adjustment.amount)}
                    <span className="text-muted-foreground">({adjustment.reason})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
