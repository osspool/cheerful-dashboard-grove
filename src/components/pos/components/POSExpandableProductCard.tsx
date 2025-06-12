
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">IMG</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="default" className="min-w-[140px]">
                Select Variant
                {isOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="border-t pt-4">
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-3">Product</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground mb-2">
                    <span>Size</span>
                    <span>Variants</span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-4 gap-4 items-center py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs">👟</span>
                        </div>
                        <span className="text-sm">{variant.size}</span>
                      </div>
                      
                      <div className="text-sm font-semibold">
                        {formatCurrency(variant.price)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(variant.costPrice)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Stock: {variant.quantity}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleAddToCart(variant)}
                          disabled={variant.quantity === 0}
                          size="sm"
                          className="min-w-[100px]"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Sale
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
