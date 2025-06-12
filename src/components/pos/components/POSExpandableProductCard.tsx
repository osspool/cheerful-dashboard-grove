
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Plus, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  costPrice: number;
  quantity: number;
  upc: string;
}

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    brand: string;
    image?: string;
    variants: ProductVariant[];
  };
}

export const POSExpandableProductCard = ({ product }: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch, state } = usePOS();

  const handleAddToCart = (variant: ProductVariant) => {
    // Transform variant data to match POSInventoryItem structure
    const inventoryItem = {
      id: variant.id,
      upc: variant.upc,
      product: {
        id: product.id,
        title: product.title,
        brand: product.brand,
        styleId: product.id,
        platform: ['external'],
      },
      variant: {
        id: variant.id,
        product: product.id,
        styleId: product.id,
        general: {
          size: variant.size,
          size_unit: 'US',
        },
      },
      quantity: variant.quantity,
      retail_price: variant.price,
      wholesale_price: variant.costPrice,
      location: [],
      platforms_available: ['external'],
    };

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        inventoryItem,
        platform: state.selectedPlatform,
      },
    });
  };

  const totalVariants = product.variants.length;
  const inStockVariants = product.variants.filter(v => v.quantity > 0).length;

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {inStockVariants}/{totalVariants} in stock
            </Badge>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  Select Size
                  {isOpen ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4">
              <div className="grid gap-3">
                <div className="grid grid-cols-5 gap-3 text-xs font-medium text-muted-foreground px-1">
                  <span>Size</span>
                  <span>Price</span>
                  <span>Cost</span>
                  <span>Stock</span>
                  <span></span>
                </div>
                
                {product.variants.map((variant) => (
                  <div key={variant.id} className="grid grid-cols-5 gap-3 items-center py-2 px-1 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">{variant.size}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm font-semibold">
                      {formatCurrency(variant.price)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(variant.costPrice)}
                    </div>
                    
                    <div>
                      <Badge 
                        variant={variant.quantity > 0 ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {variant.quantity}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleAddToCart(variant)}
                        disabled={variant.quantity === 0}
                        size="sm"
                        className="h-8 px-3"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
