
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScanBarcode, Search } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { usePOSInventoryByUPC } from '../hooks/usePOSInventory';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const POSBarcodeScanner = () => {
  const [upc, setUpc] = useState('');
  const [searchUpc, setSearchUpc] = useState('');
  const { dispatch, state } = usePOS();
  const { data: inventoryItem, isLoading, error } = usePOSInventoryByUPC(searchUpc);

  const handleScan = () => {
    if (upc.trim()) {
      setSearchUpc(upc.trim());
    }
  };

  const handleAddToCart = () => {
    if (inventoryItem) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          inventoryItem,
          platform: state.selectedPlatform,
        },
      });
      setUpc('');
      setSearchUpc('');
    }
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter or scan UPC code..."
          value={upc}
          onChange={(e) => setUpc(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          className="flex-1"
        />
        <Button onClick={handleScan} disabled={!upc.trim() || isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-destructive">Product not found for UPC: {searchUpc}</p>
          </CardContent>
        </Card>
      )}

      {inventoryItem && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{inventoryItem.product.title}</h3>
              <Badge variant="secondary">
                Qty: {inventoryItem.quantity}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{inventoryItem.product.brand}</p>
            <p className="text-sm text-muted-foreground mb-2">Size: {getDisplaySize(inventoryItem.variant)}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{formatCurrency(inventoryItem.retail_price)}</p>
                <p className="text-xs text-muted-foreground">UPC: {inventoryItem.upc}</p>
              </div>
              <div className="flex gap-1">
                {inventoryItem.platforms_available.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={inventoryItem.quantity === 0}
              className="w-full"
            >
              Add to Sale
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
