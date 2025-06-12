
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { usePOSInventory } from '../hooks/usePOSInventory';
import { formatCurrency } from '@/lib/utils';

interface POSProductGridProps {
  searchQuery: string;
}

export const POSProductGrid = ({ searchQuery }: POSProductGridProps) => {
  const { dispatch, state } = usePOS();
  const { data: inventory, isLoading } = usePOSInventory(searchQuery);

  const handleAddToCart = (inventoryItem: any) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        inventoryItem,
        platform: state.selectedPlatform,
      },
    });
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? 'No products found matching your search.' : 'Start typing to search for products.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {inventory.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm line-clamp-2">{item.product.title}</h3>
              <Badge variant="secondary" className="ml-2 text-xs">
                Qty: {item.quantity}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{item.product.brand}</p>
            <p className="text-xs text-muted-foreground mb-2">Size: {getDisplaySize(item.variant)}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{formatCurrency(item.retail_price)}</p>
                <p className="text-xs text-muted-foreground">UPC: {item.upc}</p>
              </div>
              <div className="flex gap-1">
                {item.platforms_available.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button
              onClick={() => handleAddToCart(item)}
              disabled={item.quantity === 0}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Sale
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
