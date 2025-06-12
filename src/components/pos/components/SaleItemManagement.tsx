
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, RotateCcw, DollarSign, Edit } from 'lucide-react';
import { POSCartItem, POSItemAdjustment } from '../types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SaleItemManagementProps {
  item: POSCartItem;
  onItemUpdate?: (itemId: string, updates: Partial<POSCartItem>) => void;
  onItemAdjustment?: (itemId: string, adjustment: Omit<POSItemAdjustment, 'id' | 'createdAt'>) => void;
}

export const SaleItemManagement = ({ item, onItemUpdate, onItemAdjustment }: SaleItemManagementProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(item.status);
  const [trackingNumber, setTrackingNumber] = useState(item.shippingDetails?.trackingNumber || '');
  const [carrier, setCarrier] = useState(item.shippingDetails?.carrier || '');
  const [adjustmentType, setAdjustmentType] = useState<POSItemAdjustment['type']>('price_adjustment');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const { toast } = useToast();

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

  const handleStatusUpdate = () => {
    const shippingDetails = newStatus === 'shipped' ? {
      trackingNumber,
      carrier,
      shippedAt: new Date().toISOString(),
    } : newStatus === 'delivered' ? {
      ...item.shippingDetails,
      deliveredAt: new Date().toISOString(),
    } : item.shippingDetails;

    onItemUpdate?.(item.id, {
      status: newStatus,
      shippingDetails,
    });

    toast({
      title: "Item Status Updated",
      description: `${item.inventoryItem.product.title} marked as ${newStatus}`,
    });

    setIsStatusDialogOpen(false);
  };

  const handleAddAdjustment = () => {
    if (!adjustmentAmount || !adjustmentReason) return;

    onItemAdjustment?.(item.id, {
      saleId: '', // Will be filled by parent
      itemId: item.id,
      type: adjustmentType,
      amount: parseFloat(adjustmentAmount),
      reason: adjustmentReason,
    });

    toast({
      title: "Adjustment Added",
      description: `${adjustmentType.replace('_', ' ')} of ${formatCurrency(parseFloat(adjustmentAmount))} added to ${item.inventoryItem.product.title}`,
    });

    setIsAdjustmentDialogOpen(false);
    setAdjustmentAmount('');
    setAdjustmentReason('');
  };

  const getDisplaySize = (variant: any) => {
    if (variant?.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant?.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    if (variant?.general?.size) {
      return `${variant.general.size} ${variant.general.size_unit || ''}`.trim();
    }
    return 'One Size';
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{item.inventoryItem.product.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{item.inventoryItem.product.brand} • Size: {getDisplaySize(item.inventoryItem.variant)}</p>
            <p className="text-xs text-muted-foreground">UPC: {item.inventoryItem.upc}</p>
          </div>
          <Badge className={getStatusColor(item.status)}>
            {getStatusIcon(item.status)}
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Selling Price:</span>
            <span className="font-medium ml-2">{formatCurrency(item.sellingPrice)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-medium ml-2 capitalize">{item.platform}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Item Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>New Status</Label>
                  <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
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
                      <Label>Tracking Number</Label>
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <div>
                      <Label>Carrier</Label>
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

          <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <DollarSign className="h-3 w-3 mr-1" />
                Add Adjustment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item Adjustment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Adjustment Type</Label>
                  <Select value={adjustmentType} onValueChange={(value: any) => setAdjustmentType(value)}>
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
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
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

        {item.adjustments && item.adjustments.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-medium">Adjustments:</h5>
            {item.adjustments.map((adjustment) => (
              <div key={adjustment.id} className="text-xs bg-muted/50 p-2 rounded">
                <div className="flex justify-between">
                  <Badge variant="outline" className="text-xs">
                    {adjustment.type.replace('_', ' ')}
                  </Badge>
                  <span className="font-medium">
                    {formatCurrency(adjustment.amount)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">{adjustment.reason}</p>
              </div>
            ))}
          </div>
        )}

        {item.shippingDetails && (
          <div className="text-xs bg-muted/50 p-2 rounded space-y-1">
            {item.shippingDetails.trackingNumber && (
              <div className="flex justify-between">
                <span>Tracking:</span>
                <span className="font-mono">{item.shippingDetails.trackingNumber}</span>
              </div>
            )}
            {item.shippingDetails.carrier && (
              <div className="flex justify-between">
                <span>Carrier:</span>
                <span className="capitalize">{item.shippingDetails.carrier}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
