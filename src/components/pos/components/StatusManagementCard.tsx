
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Edit, MapPin } from 'lucide-react';
import { POSSale } from '../types';
import { useToast } from '@/hooks/use-toast';

interface StatusManagementCardProps {
  sale: POSSale;
  onUpdate?: () => void;
}

export const StatusManagementCard = ({ sale, onUpdate }: StatusManagementCardProps) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [address, setAddress] = useState(sale.shippingDetails?.address || '');
  const [city, setCity] = useState(sale.shippingDetails?.city || '');
  const [state, setState] = useState(sale.shippingDetails?.state || '');
  const [zipCode, setZipCode] = useState(sale.shippingDetails?.zipCode || '');

  const { toast } = useToast();

  const handleAddressUpdate = async () => {
    try {
      // In a real app, this would call an API to update the shipping address
      console.log('Updating shipping address:', {
        saleId: sale.id,
        shippingDetails: { address, city, state, zipCode }
      });

      toast({
        title: "Address Updated",
        description: `Shipping address updated for sale ${sale.id}`,
      });

      setIsAddressDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shipping address",
        variant: "destructive",
      });
    }
  };

  // Get unique statuses from items
  const itemStatuses = sale.items.map(item => item.status);
  const uniqueStatuses = [...new Set(itemStatuses)];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Sale Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Item Status Summary</h4>
          <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-md">
            {uniqueStatuses.map(status => (
              <div key={status} className="flex justify-between">
                <span className="capitalize">{status}:</span>
                <span>{itemStatuses.filter(s => s === status).length} item(s)</span>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              {sale.shippingDetails?.address ? 'Update Address' : 'Add Shipping Address'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shipping Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
              
              <Button 
                onClick={handleAddressUpdate}
                className="w-full"
              >
                {sale.shippingDetails?.address ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Current Shipping Address */}
        {sale.shippingDetails && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Shipping Address</h4>
            <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-md">
              {sale.shippingDetails.address && (
                <div>{sale.shippingDetails.address}</div>
              )}
              {(sale.shippingDetails.city || sale.shippingDetails.state || sale.shippingDetails.zipCode) && (
                <div>
                  {sale.shippingDetails.city}, {sale.shippingDetails.state} {sale.shippingDetails.zipCode}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
          <strong>Note:</strong> Individual item status and shipping tracking are managed per item below. This section handles sale-level information only.
        </div>
      </CardContent>
    </Card>
  );
};
