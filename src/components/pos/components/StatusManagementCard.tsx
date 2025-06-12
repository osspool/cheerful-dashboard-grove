
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Edit } from 'lucide-react';
import { POSSale } from '../types';
import { useUpdateSaleStatus } from '../hooks/usePOSSales';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface StatusManagementCardProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const StatusManagementCard = ({ sale, onUpdate }: StatusManagementCardProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<POSSale['status']>(sale.status);
  const [trackingNumber, setTrackingNumber] = useState(sale.shippingDetails?.trackingNumber || '');
  const [carrier, setCarrier] = useState(sale.shippingDetails?.carrier || '');

  const updateStatusMutation = useUpdateSaleStatus();
  const { toast } = useToast();

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

  return (
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
  );
};
