
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanBarcode } from 'lucide-react';
import { ScannedInventoryItem } from '../types';

interface ScanningInterfaceProps {
  onBarcodeScan: (barcode: string) => void;
  lastScannedUpc: string | null;
  lastScannedItem: ScannedInventoryItem | null;
  isProcessing: boolean;
}

export const ScanningInterface = ({
  onBarcodeScan,
  lastScannedUpc,
  lastScannedItem,
  isProcessing
}: ScanningInterfaceProps) => {
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const getDisplaySize = (variant: any) => {
    if (variant?.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant?.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    return 'N/A';
  };
  
  // Handle barcode submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim() && !isProcessing) {
      onBarcodeScan(barcode.trim());
      setBarcode('');
    }
  };
  
  // Auto-focus the input field
  useEffect(() => {
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing, lastScannedUpc]);
  
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-4 space-y-3">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <h2 className="text-base font-semibold">Processing scan...</h2>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <ScanBarcode className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {lastScannedItem ? 'Item Found' : 'Ready to Scan'}
              </h2>
            </div>
            
            {lastScannedItem ? (
              <div className="text-center space-y-2">
                <div className="space-y-1">
                  <p className="text-base font-medium">{lastScannedItem.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {lastScannedItem.product.brand} • Size {getDisplaySize(lastScannedItem.variant)} • {lastScannedItem.product.styleId}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-sm font-semibold">{lastScannedItem.currentQuantity}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Scanned</p>
                    <p className="text-sm font-semibold text-primary">+{lastScannedItem.scannedQuantity}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-semibold">{lastScannedItem.location.join(', ')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Scan a barcode to begin inventory update</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try: <code className="bg-muted px-2 py-1 rounded text-xs">194954684154</code>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan or enter barcode..."
                  className="text-base h-9"
                  autoComplete="off"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  disabled={!barcode.trim()}
                  className="h-9 px-4"
                >
                  Scan
                </Button>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
};
