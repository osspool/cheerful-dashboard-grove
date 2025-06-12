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
import { Truck, Package, Check, RotateCcw, DollarSign, Edit, Calendar, Clock } from 'lucide-react';
import { POSSale, POSAdjustment } from '../types';
import { useUpdateSaleStatus, useAddSaleAdjustment } from '../hooks/usePOSSales';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface POSSaleManagementProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const POSSaleManagement = ({ sale, onUpdate }: POSSaleManagementProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<POSSale['status']>(sale.status);
  const [trackingNumber, setTrackingNumber] = useState(sale.shippingDetails?.trackingNumber || '');
  const [carrier, setCarrier] = useState(sale.shippingDetails?.carrier || '');
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

  const handleStatusUpdate = async () => {
    try {
      const shippingDetails = newStatus === 'shipped' ? {
        trackingNumber,
        carrier,
        shippedAt: new Date().toISOString(),
      } : newStatus === 'delivered' ? {
        ...sale.shippingDetails,
        deliveredAt: new Date().toISOString(),
      } : sale.shippingDetails;

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
      onUpdate?.();
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
    <div className="space-y-6">
      {/* Sale Overview */}
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

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Status Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Sale Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>New Status</Label>
                  <Select value={newStatus} onValueChange={(value: POSSale['status']) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newStatus === 'shipped' && (
                  <>
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
                          <SelectItem value="stockx">StockX Shipping</SelectItem>
                          <SelectItem value="goat">GOAT Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={handleStatusUpdate}
                  className="w-full"
                  disabled={newStatus === 'shipped' && (!trackingNumber || !carrier)}
                >
                  Update Status
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Current Shipping Details */}
          {sale.shippingDetails && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Shipping Information</h4>
              <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-md">
                {sale.shippingDetails.trackingNumber && (
                  <div className="flex justify-between">
                    <span>Tracking:</span>
                    <span className="font-mono">{sale.shippingDetails.trackingNumber}</span>
                  </div>
                )}
                {sale.shippingDetails.carrier && (
                  <div className="flex justify-between">
                    <span>Carrier:</span>
                    <span className="capitalize">{sale.shippingDetails.carrier}</span>
                  </div>
                )}
                {sale.shippingDetails.shippedAt && (
                  <div className="flex justify-between">
                    <span>Shipped:</span>
                    <span>{format(new Date(sale.shippingDetails.shippedAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}
                {sale.shippingDetails.deliveredAt && (
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span>{format(new Date(sale.shippingDetails.deliveredAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adjustments Section */}
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

      {/* Customer Notes */}
      {sale.customerNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sale.customerNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
