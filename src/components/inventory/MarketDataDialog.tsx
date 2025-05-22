
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Variant } from '@/components/inventory-drawer/types';
import { useStockXMarketData, useGoatMarketData } from '@/hooks/use-market-data';
import { MarketDataSheet } from './MarketDataSheet';

interface MarketDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: Variant | null;
}

export function MarketDataDialog({ 
  open, 
  onOpenChange, 
  variant
}: MarketDataDialogProps) {
  // Use our custom hooks to fetch market data
  const { data: stockXData, isLoading: isLoadingStockX } = useStockXMarketData(variant);
  const { data: goatData, isLoading: isLoadingGoat } = useGoatMarketData(variant);
  
  if (!variant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Market Data for Size {variant.size}
            <Badge variant="outline" className="ml-2">Last Updated: {new Date().toLocaleString()}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <MarketDataSheet 
          stockXData={stockXData} 
          goatData={goatData}
          variant={variant}
          isLoading={isLoadingStockX || isLoadingGoat}
        />
      </DialogContent>
    </Dialog>
  );
}
