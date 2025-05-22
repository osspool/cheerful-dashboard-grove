
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BatchItem } from './ScannerContent';

interface ScanningInterfaceProps {
  onBarcodeScan: (barcode: string) => void;
  lastScannedUpc: string | null;
  lastScannedItem: BatchItem | null;
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
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <h2 className="text-xl font-semibold">Processing...</h2>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-8">
                {lastScannedItem ? 'Item Scanned' : 'Ready to Scan'}
              </h2>
              
              {lastScannedItem ? (
                <div className="text-center mb-6 space-y-1">
                  <p className="text-2xl font-medium">
                    {lastScannedItem.isNewProduct ? 'New/Unidentified Product' : lastScannedItem.productName}
                  </p>
                  
                  {lastScannedItem.brand && !lastScannedItem.isNewProduct && (
                    <p className="text-lg text-muted-foreground">
                      {lastScannedItem.brand}
                      {lastScannedItem.color && ` | ${lastScannedItem.color}`}
                      {lastScannedItem.size && ` | Size ${lastScannedItem.size}`}
                    </p>
                  )}
                  
                  <p className="text-lg mt-2">
                    UPC: <span className="font-mono">{lastScannedUpc}</span>
                  </p>
                  
                  <div className="mt-4 bg-primary/10 rounded-md px-3 py-2 inline-flex items-center">
                    <span className="font-medium">Qty: +1</span>
                    <span className="mx-2">|</span>
                    <span className="font-medium">Total: {lastScannedItem.quantity}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-8">
                  <p className="text-xl text-muted-foreground">Scan a shoe barcode to begin</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full max-w-md relative">
                <Input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Barcode input (or type manually and press Enter)"
                  className="pr-4 py-6 text-lg h-auto"
                  autoComplete="off"
                  autoFocus
                />
                {barcode && (
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
                  >
                    Scan
                  </button>
                )}
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
