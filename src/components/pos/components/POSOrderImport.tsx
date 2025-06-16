
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Loader2 } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { POSInventoryItem } from '../types';

export const POSOrderImport = () => {
  const [orderId, setOrderId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'stockx' | 'goat'>('stockx');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedItem, setFetchedItem] = useState<POSInventoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = usePOS();

  const handleFetchOrder = async () => {
    if (!orderId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFetchedItem(null);

    try {
      // Mock API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock response data - this would come from your backend
      const mockInventoryItem: POSInventoryItem = {
        id: `inv-${Date.now()}`,
        upc: '123456789012',
        product: {
          id: `prod-${Date.now()}`,
          title: `${selectedPlatform === 'stockx' ? 'StockX' : 'GOAT'} Order Item`,
          brand: 'Nike',
          styleId: 'DQ8426-100',
          platform: [selectedPlatform],
          [selectedPlatform]: selectedPlatform === 'stockx' 
            ? { productId: orderId, styleId: 'DQ8426-100' }
            : { catalog_id: orderId, name: 'Air Jordan 1', sku: 'AJ1-001' }
        },
        variant: {
          id: `var-${Date.now()}`,
          product: `prod-${Date.now()}`,
          styleId: 'DQ8426-100',
          [selectedPlatform]: selectedPlatform === 'stockx'
            ? { productId: orderId, variantId: `${orderId}-var`, variantName: 'Size', variantValue: '9' }
            : { catalog_id: orderId, size: 9, size_unit: 'SIZE_UNIT_US' }
        },
        quantity: 1,
        retail_price: 180.00,
        wholesale_price: 140.00,
        location: ['warehouse-1'],
        platforms_available: [selectedPlatform]
      };
      
      setFetchedItem(mockInventoryItem);
    } catch (err) {
      setError('Failed to fetch order details. Please check the order ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToSale = () => {
    if (fetchedItem) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          inventoryItem: fetchedItem,
          platform: selectedPlatform,
        },
      });
      
      // Reset form
      setOrderId('');
      setFetchedItem(null);
      setError(null);
    }
  };

  const getDisplaySize = (variant: any) => {
    if (variant?.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant?.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    return 'One Size';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Platform</label>
          <Select value={selectedPlatform} onValueChange={(value: 'stockx' | 'goat') => setSelectedPlatform(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stockx">StockX</SelectItem>
              <SelectItem value="goat">GOAT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Order ID</label>
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${selectedPlatform.toUpperCase()} order ID...`}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchOrder()}
              className="flex-1"
            />
            <Button 
              onClick={handleFetchOrder} 
              disabled={!orderId.trim() || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Fetch Order'
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {fetchedItem && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{fetchedItem.product.title}</h3>
              <Badge variant="outline" className="bg-white">
                <Package className="h-3 w-3 mr-1" />
                {selectedPlatform.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{fetchedItem.product.brand}</p>
            <p className="text-sm text-muted-foreground mb-2">Size: {getDisplaySize(fetchedItem.variant)}</p>
            <p className="text-sm text-muted-foreground mb-3">Order ID: {orderId}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{formatCurrency(fetchedItem.retail_price)}</p>
                <p className="text-xs text-muted-foreground">
                  Cost: {formatCurrency(fetchedItem.wholesale_price || 0)}
                </p>
              </div>
            </div>
            
            <Button onClick={handleAddToSale} className="w-full bg-green-600 hover:bg-green-700">
              Add to Sale
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
