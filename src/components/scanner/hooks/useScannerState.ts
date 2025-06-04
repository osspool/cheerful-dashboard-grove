
import { useState, useEffect } from 'react';
import { ScannedInventoryItem } from '../types';

export const useScannerState = () => {
  const [scannedItems, setScannedItems] = useState<ScannedInventoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedUpc, setLastScannedUpc] = useState<string | null>(null);
  const [operationMode, setOperationMode] = useState<'receiving' | 'shipping'>('receiving');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scannedItems');
    const savedMode = localStorage.getItem('operationMode');
    
    if (saved) {
      try {
        setScannedItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved items:', error);
      }
    }
    
    if (savedMode && (savedMode === 'receiving' || savedMode === 'shipping')) {
      setOperationMode(savedMode);
    }
  }, []);

  // Save to localStorage whenever scannedItems or operationMode changes
  useEffect(() => {
    localStorage.setItem('scannedItems', JSON.stringify(scannedItems));
  }, [scannedItems]);

  useEffect(() => {
    localStorage.setItem('operationMode', operationMode);
  }, [operationMode]);

  const clearScannedItems = () => {
    setScannedItems([]);
    setLastScannedUpc(null);
    localStorage.removeItem('scannedItems');
  };

  return {
    scannedItems,
    setScannedItems,
    isProcessing,
    setIsProcessing,
    lastScannedUpc,
    setLastScannedUpc,
    operationMode,
    setOperationMode,
    clearScannedItems
  };
};
