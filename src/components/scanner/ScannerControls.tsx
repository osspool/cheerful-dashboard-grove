
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plus, Minus, Trash2, Package, Truck } from 'lucide-react';

interface ScannerControlsProps {
  onSubmitUpdates: (operation: 'increment' | 'decrement') => void;
  onClearAll: () => void;
  itemsCount: number;
  isProcessing: boolean;
  operationMode: 'receiving' | 'shipping';
  onModeChange: (mode: 'receiving' | 'shipping') => void;
}

export const ScannerControls = ({
  onSubmitUpdates,
  onClearAll,
  itemsCount,
  isProcessing,
  operationMode,
  onModeChange
}: ScannerControlsProps) => {
  const handleSubmit = () => {
    const operation = operationMode === 'receiving' ? 'increment' : 'decrement';
    onSubmitUpdates(operation);
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    return operationMode === 'receiving' ? 'Add To Inventory' : 'Remove From Inventory';
  };

  const getButtonIcon = () => {
    return operationMode === 'receiving' ? Plus : Minus;
  };

  const ButtonIcon = getButtonIcon();

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Operation Mode Selector */}
        <div className="flex items-center justify-center">
          <ToggleGroup
            type="single"
            value={operationMode}
            onValueChange={(value) => value && onModeChange(value as 'receiving' | 'shipping')}
            className="grid w-full max-w-sm grid-cols-2 bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="receiving"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=on]:bg-background data-[state=on]:text-green-700 data-[state=on]:shadow-sm data-[state=off]:text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Receiving
            </ToggleGroupItem>
            <ToggleGroupItem
              value="shipping"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=on]:bg-background data-[state=on]:text-red-700 data-[state=on]:shadow-sm data-[state=off]:text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-4 w-4" />
              Shipping
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'} ready for {operationMode}
            </div>
            {itemsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                disabled={isProcessing}
                className="gap-2 h-8"
              >
                <Trash2 className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={itemsCount === 0 || isProcessing}
            className={`gap-2 px-4 h-9 ${
              operationMode === 'receiving' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ButtonIcon className="h-4 w-4" />
            {getButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
