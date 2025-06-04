
import React, { useState, useEffect } from 'react';
import { ScanningInterface } from './ScanningInterface';
import { ScannedItemsList } from './ScannedItemsList';
import { ScannerControls } from './ScannerControls';
import { toast } from '@/hooks/use-toast';
import { useScannerOperations } from '@/hooks/use-scanner-operations';
import { ScannedInventoryItem } from './types';

export const ScannerContent = () => {
  const [scannedItems, setScannedItems] = useState<ScannedInventoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedUpc, setLastScannedUpc] = useState<string | null>(null);
  
  const { 
    scanBarcode, 
    updateInventoryQuantities,
    isLoading
  } = useScannerOperations();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scannedItems');
    if (saved) {
      try {
        setScannedItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever scannedItems changes
  useEffect(() => {
    localStorage.setItem('scannedItems', JSON.stringify(scannedItems));
  }, [scannedItems]);

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
        
        toast({
          title: "Item Scanned",
          description: `${inventory.product.title} - Size ${getDisplaySize(inventory.variant)}`,
        });
      } else {
        toast({
          title: "Item Not Found",
          description: `No inventory found for UPC: ${upcCode}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to scan barcode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getDisplaySize = (variant: any) => {
    if (variant.stockx?.variantValue) {
      return variant.stockx.variantValue;
    }
    if (variant.goat?.size) {
      return `${variant.goat.size}${variant.goat.size_unit === 'SIZE_UNIT_US' ? ' US' : ''}`;
    }
    return 'N/A';
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
      
      toast({
        title: "Inventory Updated",
        description: `Successfully ${operation}ed quantities for ${updates.length} items.`,
      });
      
      // Clear scanned items
      setScannedItems([]);
      setLastScannedUpc(null);
      localStorage.removeItem('scannedItems');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update inventory quantities.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = () => {
    setScannedItems([]);
    setLastScannedUpc(null);
    localStorage.removeItem('scannedItems');
  };

  const lastScannedItem = lastScannedUpc ? 
    scannedItems.find(item => item.upc === lastScannedUpc) : null;

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quick Scanner</h1>
        <div className="text-sm text-muted-foreground">
          {scannedItems.length} item{scannedItems.length !== 1 ? 's' : ''} scanned
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
          onClearAll={handleClearAll}
          itemsCount={scannedItems.length}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};
