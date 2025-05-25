
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Package, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InventoryItem {
  upc: string;
  product: {
    title: string;
    brand: string;
    styleId: string;
  };
  variant: {
    size: string;
    general: {
      size: string;
      size_unit: string;
    };
  };
  quantity: number;
  retail_price: number;
  location: string[];
}

export const QuickScannerContent = () => {
  const [upc, setUpc] = useState('');
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<'add' | 'remove'>('add');

  // Mock data for demonstration
  const mockInventoryLookup = (upcCode: string): InventoryItem | null => {
    const mockItems: InventoryItem[] = [
      {
        upc: '123456789012',
        product: {
          title: 'Air Jordan 1 Retro High OG "Bred Toe"',
          brand: 'Jordan',
          styleId: 'AJ1-BRED-TOE'
        },
        variant: {
          size: '10',
          general: {
            size: '10',
            size_unit: 'US'
          }
        },
        quantity: 5,
        retail_price: 170,
        location: ['A1', 'B2']
      }
    ];
    
    return mockItems.find(item => item.upc === upcCode) || null;
  };

  const handleScan = async () => {
    if (!upc.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const item = mockInventoryLookup(upc.trim());
      if (item) {
        setScannedItem(item);
      } else {
        toast({
          title: "Item not found",
          description: `No inventory item found for UPC: ${upc}`,
          variant: "destructive",
        });
        setScannedItem(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to look up item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityUpdate = async (change: number) => {
    if (!scannedItem) return;

    const newQuantity = Math.max(0, scannedItem.quantity + change);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setScannedItem({
        ...scannedItem,
        quantity: newQuantity
      });

      const actionText = change > 0 ? 'added to' : 'removed from';
      toast({
        title: "Inventory Updated",
        description: `${Math.abs(change)} item ${actionText} inventory. New quantity: ${newQuantity}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan();
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quick Inventory Scanner</h1>
        <div className="flex gap-2">
          <Button
            variant={operation === 'add' ? 'default' : 'outline'}
            onClick={() => setOperation('add')}
            className="gap-2"
          >
            <Package size={16} />
            Receive Items
          </Button>
          <Button
            variant={operation === 'remove' ? 'default' : 'outline'}
            onClick={() => setOperation('remove')}
            className="gap-2"
          >
            <Truck size={16} />
            Ship Items
          </Button>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {operation === 'add' ? 'Scan to Add Inventory' : 'Scan to Ship Items'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={upc}
                onChange={(e) => setUpc(e.target.value)}
                placeholder="Scan or enter UPC barcode"
                className="pr-20 h-12 text-lg"
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={!upc.trim() || isLoading}
                className="absolute right-1 top-1 h-10"
              >
                {isLoading ? 'Looking up...' : 'Scan'}
              </Button>
            </div>
          </form>

          {scannedItem && (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{scannedItem.product.title}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>{scannedItem.product.brand}</span>
                    <span>•</span>
                    <span>Size {scannedItem.variant.general.size}{scannedItem.variant.general.size_unit}</span>
                    <span>•</span>
                    <span>SKU: {scannedItem.product.styleId}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Locations:</span>
                    {scannedItem.location.map((loc, idx) => (
                      <Badge key={idx} variant="outline">{loc}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/20 rounded-lg p-4">
                  <div className="text-center space-y-3">
                    <div className="text-sm text-muted-foreground">Current Quantity</div>
                    <div className="text-3xl font-bold">{scannedItem.quantity}</div>
                    
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleQuantityUpdate(-1)}
                        disabled={scannedItem.quantity <= 0}
                        className="gap-2"
                      >
                        <Minus size={16} />
                        Remove 1
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleQuantityUpdate(1)}
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Add 1
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setScannedItem(null);
                      setUpc('');
                    }}
                  >
                    Scan Another Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
