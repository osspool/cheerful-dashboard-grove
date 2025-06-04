
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { ScannedInventoryItem } from './ScannerContent';

interface ScannedItemsListProps {
  items: ScannedInventoryItem[];
  onUpdateQuantity: (inventoryId: string, newQuantity: number) => void;
  onRemoveItem: (inventoryId: string) => void;
  isProcessing: boolean;
}

export const ScannedItemsList = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  isProcessing 
}: ScannedItemsListProps) => {
  const getDisplaySize = (variant: any) => {
    if (variant.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    return 'N/A';
  };

  if (items.length === 0) {
    return (
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Scanned Items
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Package className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">No items scanned yet</p>
          <p className="text-sm">Start scanning to see items here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-grow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Scanned Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Current Qty</TableHead>
                <TableHead className="text-center">Scanned</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.inventoryId}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.product.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.product.brand} • {item.product.styleId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        UPC: {item.upc}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {getDisplaySize(item.variant)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.location.map((loc, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.currentQuantity}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.inventoryId, item.scannedQuantity - 1)}
                        disabled={isProcessing || item.scannedQuantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.scannedQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateQuantity(item.inventoryId, value);
                        }}
                        className="w-16 text-center h-8"
                        min="1"
                        disabled={isProcessing}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.inventoryId, item.scannedQuantity + 1)}
                        disabled={isProcessing}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.inventoryId)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
