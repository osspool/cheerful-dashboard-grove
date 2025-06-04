import { useState } from 'react';
import { apiClient, mockApiDelay } from '@/utils/apiClient';
import { BatchItem } from '@/components/scanner/types';

// Mock product data
const mockProducts = [
  { 
    upcCode: '123456789012', 
    productName: 'Nike Air Max 270', 
    brand: 'Nike', 
    color: 'Black/White', 
    size: 'US 10M' 
  },
  { 
    upcCode: '234567890123', 
    productName: 'Adidas Ultraboost 22', 
    brand: 'Adidas', 
    color: 'Grey', 
    size: 'US 9.5M' 
  },
  { 
    upcCode: '345678901234', 
    productName: 'New Balance 990v5', 
    brand: 'New Balance', 
    color: 'Navy', 
    size: 'US 11M' 
  },
  { 
    upcCode: '456789012345', 
    productName: 'Puma RS-X', 
    brand: 'Puma', 
    color: 'White/Red', 
    size: 'US 8.5M' 
  }
];

interface ProductInfo {
  upcCode: string;
  productName: string;
  brand?: string;
  color?: string;
  size?: string;
}

interface BatchUpdateResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{upcCode: string, error: string}>;
}

export const useBarcodeData = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Look up a barcode in the local cache
   */
  const lookupBarcode = async (upcCode: string): Promise<ProductInfo | null> => {
    // Simulate a quick local lookup
    await mockApiDelay(50);
    
    const product = mockProducts.find(p => p.upcCode === upcCode);
    return product || null;
  };

  /**
   * Resolve an unknown barcode by checking with the backend
   */
  const resolveUnknownBarcode = async (upcCode: string): Promise<ProductInfo | null> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to the backend
      // Simulate an API call with a longer delay (250-750ms)
      await mockApiDelay(Math.random() * 500 + 250);
      
      // For demonstration, randomly decide if this UPC can be resolved
      // In a real app, this would come from the backend response
      if (Math.random() > 0.3) {
        // Simulate a successful resolution from backend
        // Generate a random product for demonstration
        const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour', 'Reebok'];
        const colors = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Green', 'Yellow'];
        const sizes = ['US 7M', 'US 8M', 'US 9M', 'US 10M', 'US 11M', 'US 12M'];
        
        // Create a resolved product with random attributes
        const resolvedProduct: ProductInfo = {
          upcCode,
          productName: `Resolved Shoe ${upcCode.substring(0, 4)}`,
          brand: brands[Math.floor(Math.random() * brands.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: sizes[Math.floor(Math.random() * sizes.length)]
        };
        
        return resolvedProduct;
      }
      
      return null;
    } catch (error) {
      console.error('Error resolving unknown barcode:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Process the entire batch update
   */
  const processBatchUpdate = async (batchItems: BatchItem[]): Promise<BatchUpdateResult> => {
    setIsLoading(true);
    try {
      // Prepare the payload for the batch update
      const payload = {
        transaction_type: 'receive_stock',
        user_id: 'current-user-id', // This would come from authentication context in a real app
        items: batchItems.map(item => ({
          upc_code: item.upcCode,
          quantity_change: item.quantity
        }))
      };
      
      // In a real app, this would be an API call to the backend
      await mockApiDelay(1000); // Simulate a longer API call for batch processing
      
      // For demonstration, simulate a successful batch update
      const processedCount = batchItems.length;
      
      // Return a successful result
      return {
        success: true,
        processedCount,
        failedCount: 0
      };
    } catch (error) {
      console.error('Error processing batch update:', error);
      throw new Error('Failed to process batch update');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupBarcode,
    resolveUnknownBarcode,
    processBatchUpdate,
    isLoading
  };
};
