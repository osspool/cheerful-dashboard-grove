
import React, { useState, useRef, useEffect } from 'react';
import { ScanningInterface } from './ScanningInterface';
import { BatchItemsList } from './BatchItemsList';
import { BatchControls } from './BatchControls';
import { toast } from '@/hooks/use-toast';
import { useBarcodeData } from '@/hooks/use-barcode-data';

export interface BatchItem {
  upcCode: string;
  productName: string;
  brand?: string;
  color?: string;
  size?: string;
  quantity: number;
  isNewProduct: boolean;
}

export const ScannerContent = () => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedUpc, setLastScannedUpc] = useState<string | null>(null);
  
  const { 
    lookupBarcode, 
    resolveUnknownBarcode,
    processBatchUpdate,
    isLoading
  } = useBarcodeData();

  const handleBarcodeScan = async (upcCode: string) => {
    if (!upcCode) return;
    
    setLastScannedUpc(upcCode);
    
    // Look up in local cache first
    const productInfo = await lookupBarcode(upcCode);
    
    // Add or update the scanned item in the batch
    setBatchItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.upcCode === upcCode);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Create new batch item
        const newItem: BatchItem = {
          upcCode,
          productName: productInfo?.productName || 'New/Unidentified Product',
          brand: productInfo?.brand,
          color: productInfo?.color,
          size: productInfo?.size,
          quantity: 1,
          isNewProduct: !productInfo
        };
        
        // If unknown product, try to resolve it asynchronously
        if (!productInfo) {
          resolveUnknownBarcode(upcCode).then(resolvedProduct => {
            if (resolvedProduct) {
              setBatchItems(prevItems => {
                return prevItems.map(item => {
                  if (item.upcCode === upcCode) {
                    return {
                      ...item,
                      productName: resolvedProduct.productName,
                      brand: resolvedProduct.brand,
                      color: resolvedProduct.color,
                      size: resolvedProduct.size,
                      isNewProduct: false
                    };
                  }
                  return item;
                });
              });
            }
          });
        }
        
        return [...prevItems, newItem];
      }
    });
  };

  const handleSubmitBatch = async () => {
    if (batchItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Submit batch to backend
      const result = await processBatchUpdate(batchItems);
      
      // Show success message
      toast({
        title: "Batch Updated!",
        description: `${result.processedCount} items processed successfully.`,
        variant: "default",
      });
      
      // Reset the batch
      setBatchItems([]);
      setLastScannedUpc(null);
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description: "Could not update batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearBatch = () => {
    setBatchItems([]);
    setLastScannedUpc(null);
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inventory Receiving Scanner</h1>
      
      <div className="flex flex-col space-y-6 flex-grow">
        <ScanningInterface 
          onBarcodeScan={handleBarcodeScan}
          lastScannedUpc={lastScannedUpc}
          lastScannedItem={lastScannedUpc ? batchItems.find(item => item.upcCode === lastScannedUpc) : null}
          isProcessing={isProcessing || isLoading}
        />
        
        <BatchItemsList 
          items={batchItems}
          isProcessing={isProcessing}
        />
        
        <BatchControls
          onSubmitBatch={handleSubmitBatch}
          onClearBatch={handleClearBatch}
          batchItemsCount={batchItems.length}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};
