
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Variant } from '@/components/inventory-drawer/types';
import { useStockXMarketData, useGoatMarketData } from '@/hooks/use-market-data';
import { MarketDataSheet } from './MarketDataSheet';
import { X } from 'lucide-react';

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between mb-6 border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            Market Data for Size {variant.size}
            <Badge variant="outline" className="ml-2">Last Updated: {new Date().toLocaleString()}</Badge>
          </SheetTitle>
          <SheetClose className="rounded-full hover:bg-secondary h-8 w-8 flex items-center justify-center">
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>
        
        <div className="overflow-y-auto pr-4">
          <MarketDataSheet 
            stockXData={stockXData} 
            goatData={goatData}
            variant={variant}
            isLoading={isLoadingStockX || isLoadingGoat}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
