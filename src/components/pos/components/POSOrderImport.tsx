
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { POSInventoryItem } from '../types';
import { salesApiClient, OrderLookupResponse } from '@/utils/salesApiClient';
import { useToast } from '@/hooks/use-toast';

export const POSOrderImport = () => {
  const [orderId, setOrderId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'stockx' | 'goat'>('stockx');
  const [isLoading, setIsLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<OrderLookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = usePOS();
  const { toast } = useToast();

  const handleLookupOrder = async () => {
    if (!orderId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setLookupResult(null);

    try {
      const result = await salesApiClient.lookupPlatformOrder(selectedPlatform, orderId.trim());
      setLookupResult(result);

      if (!result.success || result.status === 'ORDER_NOT_FOUND') {
        setError(result.message || 'Order not found');
      } else if (result.status === 'PRODUCT_FOUND_NO_INVENTORY') {
        setError('Product found but no inventory available');
      }
    } catch (err) {
      console.error('Order lookup error:', err);
      setError('Failed to lookup order. Please check the order ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToSale = () => {
    if (lookupResult?.orderData) {
      const orderData = lookupResult.orderData;
      
      // Convert the order data to POSInventoryItem format
      const inventoryItem: POSInventoryItem = {
        id: orderData.inventoryId,
        upc: orderData.inventoryInfo.upc,
        product: {
          id: orderData.product.productId,
          title: orderData.product.name,
          brand: orderData.product.brand,
          styleId: orderData.product.styleId,
          platform: [selectedPlatform],
          [selectedPlatform]: selectedPlatform === 'stockx' 
            ? { productId: orderId, styleId: orderData.product.styleId }
            : { catalog_id: orderData.product.catalogId || orderId, name: orderData.product.name, sku: orderData.product.styleId }
        },
        variant: {
          id: `var-${Date.now()}`,
          product: orderData.product.productId,
          styleId: orderData.product.styleId,
          [selectedPlatform]: selectedPlatform === 'stockx'
            ? { 
                productId: orderId, 
                variantId: `${orderId}-var`, 
                variantName: 'Size', 
                variantValue: orderData.product.size 
              }
            : { 
                catalog_id: orderData.product.catalogId || orderId, 
                size: parseFloat(orderData.product.size) || 10, 
                size_unit: 'SIZE_UNIT_US' 
              }
        },
        quantity: orderData.inventoryInfo.availableQuantity,
        retail_price: orderData.soldPrice,
        wholesale_price: orderData.soldPrice - orderData.payout.totalAdjustments,
        location: orderData.inventoryInfo.location,
        platforms_available: [selectedPlatform]
      };
      
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          inventoryItem,
          platform: selectedPlatform,
        },
      });
      
      toast({
        title: "Order Added to Sale",
        description: `${orderData.product.name} added to cart`,
      });
      
      // Reset form
      setOrderId('');
      setLookupResult(null);
      setError(null);
    }
  };

  const getStatusIcon = () => {
    if (!lookupResult) return null;
    
    switch (lookupResult.status) {
      case 'READY_TO_CREATE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PRODUCT_FOUND_NO_INVENTORY':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'ORDER_NOT_FOUND':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!lookupResult) return 'border-gray-200 bg-gray-50';
    
    switch (lookupResult.status) {
      case 'READY_TO_CREATE':
        return 'border-green-200 bg-green-50';
      case 'PRODUCT_FOUND_NO_INVENTORY':
        return 'border-yellow-200 bg-yellow-50';
      case 'ORDER_NOT_FOUND':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
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
              onKeyPress={(e) => e.key === 'Enter' && handleLookupOrder()}
              className="flex-1"
            />
            <Button 
              onClick={handleLookupOrder} 
              disabled={!orderId.trim() || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Lookup Order'
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {lookupResult?.orderData && (
        <Card className={getStatusColor()}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{lookupResult.orderData.product.name}</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <Badge variant="outline" className="bg-white">
                  <Package className="h-3 w-3 mr-1" />
                  {selectedPlatform.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{lookupResult.orderData.product.brand}</p>
            <p className="text-sm text-muted-foreground mb-2">
              Size: {lookupResult.orderData.product.size}
            </p>
            <p className="text-sm text-muted-foreground mb-3">Order ID: {orderId}</p>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span>Sale Price:</span>
                <span className="font-medium">{formatCurrency(lookupResult.orderData.soldPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Platform Fees:</span>
                <span className="text-red-600">{formatCurrency(Math.abs(lookupResult.orderData.payout.totalAdjustments))}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Net Payout:</span>
                <span className="text-green-600">{formatCurrency(lookupResult.orderData.payout.totalPayout)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Available Qty:</span>
                <span>{lookupResult.orderData.inventoryInfo.availableQuantity}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Platform Status:</p>
              <Badge variant="secondary" className="text-xs">
                {lookupResult.orderData.platformStatus}
              </Badge>
            </div>
            
            {lookupResult.status === 'READY_TO_CREATE' && (
              <Button onClick={handleAddToSale} className="w-full bg-green-600 hover:bg-green-700">
                Add to Sale
              </Button>
            )}

            {lookupResult.status !== 'READY_TO_CREATE' && (
              <div className="text-center p-2 bg-white rounded border text-sm text-muted-foreground">
                {lookupResult.message}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
