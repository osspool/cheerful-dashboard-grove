
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit } from 'lucide-react';
import { POSCartItem } from '../types';
import { usePOS } from '../context/POSContext';
import { formatCurrency } from '@/lib/utils';

interface POSCartItemCardProps {
  item: POSCartItem;
  index: number;
}

export const POSCartItemCard = ({ item, index }: POSCartItemCardProps) => {
  const { dispatch } = usePOS();
  const [isEditing, setIsEditing] = useState(false);
  const [sellingPrice, setSellingPrice] = useState((item.sellingPrice || 0).toString());
  const [costPrice, setCostPrice] = useState((item.costPrice || 0).toString());
  const [platform, setPlatform] = useState(item.platform);

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
  };

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {
        id: item.id,
        updates: {
          sellingPrice: parseFloat(sellingPrice) || item.sellingPrice || 0,
          costPrice: parseFloat(costPrice) || item.costPrice || 0,
          platform,
        },
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSellingPrice((item.sellingPrice || 0).toString());
    setCostPrice((item.costPrice || 0).toString());
    setPlatform(item.platform);
    setIsEditing(false);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value as 'stockx' | 'goat' | 'external');
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

  const profit = (item.sellingPrice || 0) - (item.costPrice || 0);

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.inventoryItem.product.title}</h4>
            <p className="text-xs text-muted-foreground">{item.inventoryItem.product.brand}</p>
            <p className="text-xs text-muted-foreground">Size: {getDisplaySize(item.inventoryItem.variant)}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`selling-${index}`} className="text-xs">Selling Price</Label>
                <Input
                  id={`selling-${index}`}
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor={`cost-${index}`} className="text-xs">Cost Price</Label>
                <Input
                  id={`cost-${index}`}
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Platform</Label>
              <Select value={platform} onValueChange={handlePlatformChange}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External/Local</SelectItem>
                  <SelectItem value="stockx">StockX</SelectItem>
                  <SelectItem value="goat">GOAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selling:</span>
              <span className="font-medium">{formatCurrency(item.sellingPrice || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost:</span>
              <span>{formatCurrency(item.costPrice || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Profit:</span>
              <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(profit)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Platform:</span>
              <span className="capitalize font-medium">{item.platform}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
