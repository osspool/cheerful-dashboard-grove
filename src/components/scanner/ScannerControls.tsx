
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface ScannerControlsProps {
  onSubmitUpdates: (operation: 'increment' | 'decrement') => void;
  onClearAll: () => void;
  itemsCount: number;
  isProcessing: boolean;
}

export const ScannerControls = ({
  onSubmitUpdates,
  onClearAll,
  itemsCount,
  isProcessing
}: ScannerControlsProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'} ready for update
          </div>
          {itemsCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              disabled={isProcessing}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onSubmitUpdates('decrement')}
            disabled={itemsCount === 0 || isProcessing}
            className="gap-2"
          >
            <Minus className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Remove From Inventory'}
          </Button>
          <Button
            onClick={() => onSubmitUpdates('increment')}
            disabled={itemsCount === 0 || isProcessing}
            className="gap-2 px-6"
          >
            <Plus className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Add To Inventory'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
