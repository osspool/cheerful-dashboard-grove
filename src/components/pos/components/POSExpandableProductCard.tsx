
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Plus, Package } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [platform, setPlatform] = useState<'stockx' | 'goat' | 'external'>('stockx');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { dispatch, state } = usePOS();
  const { toast } = useToast();

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSellingPrice(variant.price.toString());
    setIsOpen(false);
  };

  const handleCreateOrder = async () => {
    if (!selectedVariant) return;

    setIsCreatingOrder(true);
    
    try {
      // Transform variant data to match POSInventoryItem structure
      const inventoryItem = {
        id: selectedVariant.id,
        upc: selectedVariant.upc,
        product: {
          id: product.id,
          title: product.title,
          brand: product.brand,
          styleId: product.id,
          platform: [platform],
        },
        variant: {
          id: selectedVariant.id,
          product: product.id,
          styleId: product.id,
          general: {
            size: selectedVariant.size,
            size_unit: 'US',
          },
        },
        quantity: 1, // Always 1 for StockX/GOAT
        retail_price: parseFloat(sellingPrice) || selectedVariant.price,
        wholesale_price: selectedVariant.costPrice,
        location: [],
        platforms_available: [platform],
      };

      const newOrder = {
        id: `ORDER-${Date.now()}`,
        inventoryItem,
        sellingPrice: parseFloat(sellingPrice) || selectedVariant.price,
        costPrice: selectedVariant.costPrice,
        platform,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: 'CREATE_ORDER',
        payload: newOrder,
      });

      toast({
        title: "Order Created",
        description: `Order ${newOrder.id} created successfully for ${product.title} - Size ${selectedVariant.size}`,
      });

      // Reset form
      setSelectedVariant(null);
      setSellingPrice('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
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
                  Create Order
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
            <div className="border-t pt-4 space-y-4">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform</Label>
                <Select value={platform} onValueChange={(value: 'stockx' | 'goat' | 'external') => setPlatform(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stockx">StockX</SelectItem>
                    <SelectItem value="goat">GOAT</SelectItem>
                    <SelectItem value="external">External/Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Size</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                      size="sm"
                      disabled={variant.quantity === 0}
                      onClick={() => handleVariantSelect(variant)}
                      className="justify-between"
                    >
                      <span>Size {variant.size}</span>
                      <Badge variant={variant.quantity > 0 ? "secondary" : "outline"} className="text-xs">
                        {variant.quantity}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              {selectedVariant && (
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="selling-price" className="text-sm">Selling Price</Label>
                      <Input
                        id="selling-price"
                        type="number"
                        step="0.01"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Cost Price</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm flex items-center">
                        {formatCurrency(selectedVariant.costPrice)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Estimated Profit:</span>
                    <span className={(parseFloat(sellingPrice) || selectedVariant.price) - selectedVariant.costPrice >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency((parseFloat(sellingPrice) || selectedVariant.price) - selectedVariant.costPrice)}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder || !sellingPrice}
                    className="w-full"
                  >
                    {isCreatingOrder ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
