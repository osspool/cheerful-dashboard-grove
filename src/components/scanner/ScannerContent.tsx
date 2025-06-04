
import React from 'react';
import { toast } from 'sonner';
import { useScannerOperations } from '@/hooks/use-scanner-operations';
import { useScannerState } from './hooks/useScannerState';
import { ScanningInterface } from './components/ScanningInterface';
import { ScannedItemsList } from './components/ScannedItemsList';
import { ScannerControls } from './components/ScannerControls';
import { ScannedInventoryItem } from './types';
import { getDisplaySize, formatToastMessage } from './utils/scannerUtils';

export const ScannerContent = () => {
  const {
    scannedItems,
    setScannedItems,
    isProcessing,
    setIsProcessing,
    lastScannedUpc,
    setLastScannedUpc,
    operationMode,
    setOperationMode,
    clearScannedItems
  } = useScannerState();

  const { 
    scanBarcode, 
    updateInventoryQuantities,
    isLoading
  } = useScannerOperations();

  const handleBarcodeScan = async (upcCode: string) => {
    if (!upcCode || isProcessing) return;
    
    setIsProcessing(true);
    setLastScannedUpc(upcCode);
    
    try {
      const result = await scanBarcode(upcCode);
      
      if (result.status === 'success' && result.data?.inventory) {
        const inventory = result.data.inventory;
        
        // Check if item already exists in scanned list
        setScannedItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.inventoryId === inventory._id);
          
          if (existingIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...prevItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              scannedQuantity: updatedItems[existingIndex].scannedQuantity + 1
            };
            return updatedItems;
          } else {
            // Add new item
            const newItem: ScannedInventoryItem = {
              inventoryId: inventory._id,
              upc: inventory.upc,
              product: inventory.product,
              variant: inventory.variant,
              currentQuantity: inventory.quantity,
              scannedQuantity: 1,
              location: inventory.location,
              retail_price: inventory.retail_price,
              platforms_available: inventory.platforms_available
            };
            return [...prevItems, newItem];
          }
        });
        
        toast.success(formatToastMessage(inventory, operationMode));
      } else {
        toast.error(`Item Not Found: No inventory found for UPC: ${upcCode}`);
      }
    } catch (error) {
      toast.error("Scan Error: Failed to scan barcode. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = (inventoryId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setScannedItems(prevItems =>
      prevItems.map(item =>
        item.inventoryId === inventoryId
          ? { ...item, scannedQuantity: newQuantity }
          : item
      ).filter(item => item.scannedQuantity > 0)
    );
  };

  const handleRemoveItem = (inventoryId: string) => {
    setScannedItems(prevItems => 
      prevItems.filter(item => item.inventoryId !== inventoryId)
    );
  };

  const handleSubmitUpdates = async (operation: 'increment' | 'decrement') => {
    if (scannedItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      const updates = scannedItems.map(item => ({
        inventoryId: item.inventoryId,
        quantity: item.scannedQuantity
      }));
      
      await updateInventoryQuantities({ updates, operation });
      
      const actionText = operation === 'increment' ? 'added to' : 'removed from';
      toast.success(`Inventory Updated: Successfully ${actionText} inventory for ${updates.length} items.`);
      
      clearScannedItems();
    } catch (error) {
      toast.error("Update Failed: Failed to update inventory quantities.");
    } finally {
      setIsProcessing(false);
    }
  };

  const lastScannedItem = lastScannedUpc ? 
    scannedItems.find(item => item.upc === lastScannedUpc) : null;

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quick Scanner</h1>
        <div className="text-sm text-muted-foreground">
          {scannedItems.length} item{scannedItems.length !== 1 ? 's' : ''} scanned • {operationMode} mode
        </div>
      </div>
      
      <div className="flex flex-col space-y-6 flex-grow">
        <ScanningInterface 
          onBarcodeScan={handleBarcodeScan}
          lastScannedUpc={lastScannedUpc}
          lastScannedItem={lastScannedItem}
          isProcessing={isProcessing || isLoading}
        />
        
        <ScannedItemsList 
          items={scannedItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          isProcessing={isProcessing}
        />
        
        <ScannerControls
          onSubmitUpdates={handleSubmitUpdates}
          onClearAll={clearScannedItems}
          itemsCount={scannedItems.length}
          isProcessing={isProcessing}
          operationMode={operationMode}
          onModeChange={setOperationMode}
        />
      </div>
    </div>
  );
};
