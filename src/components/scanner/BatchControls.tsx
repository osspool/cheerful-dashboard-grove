
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BatchControlsProps {
  onSubmitBatch: () => void;
  onClearBatch: () => void;
  batchItemsCount: number;
  isProcessing: boolean;
}

export const BatchControls = ({
  onSubmitBatch,
  onClearBatch,
  batchItemsCount,
  isProcessing
}: BatchControlsProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-lg font-medium">
            {batchItemsCount} {batchItemsCount === 1 ? 'item' : 'items'} in batch
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClearBatch}
            disabled={batchItemsCount === 0 || isProcessing}
          >
            Clear Batch
          </Button>
          <Button
            onClick={onSubmitBatch}
            disabled={batchItemsCount === 0 || isProcessing}
            className="px-8"
          >
            {isProcessing ? 'Processing...' : 'Confirm & Update Inventory'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
