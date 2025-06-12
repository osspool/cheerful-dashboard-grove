
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Trash2, ShoppingCart } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { POSCartItemCard } from './POSCartItemCard';
import { POSCheckout } from './POSCheckout';
import { formatCurrency } from '@/lib/utils';

export const POSCart = () => {
  const { state, dispatch } = usePOS();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = state.cartItems.reduce((sum, item) => sum + item.sellingPrice, 0);
  const total = subtotal; // Add taxes, discounts later

  const handlePlatformChange = (platform: 'stockx' | 'goat' | 'external') => {
    dispatch({ type: 'SET_PLATFORM', payload: platform });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleCheckoutComplete = () => {
    dispatch({ type: 'CLEAR_CART' });
    setIsCheckoutOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sale Items ({state.cartItems.length})
          </CardTitle>
          {state.cartItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Platform</label>
          <Select value={state.selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="external">External/Local</SelectItem>
              <SelectItem value="stockx">StockX</SelectItem>
              <SelectItem value="goat">GOAT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-6">
        {state.cartItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No items in cart</p>
            <p className="text-sm">Add products to start a sale</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.cartItems.map((item, index) => (
              <POSCartItemCard key={`${item.inventoryItem.id}-${index}`} item={item} index={index} />
            ))}
          </div>
        )}
      </div>

      {state.cartItems.length > 0 && (
        <div className="border-t bg-card/50 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <SheetTrigger asChild>
              <Button className="w-full" size="lg">
                Complete Sale
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Checkout</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <POSCheckout
                  onComplete={handleCheckoutComplete}
                  onCancel={() => setIsCheckoutOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};
