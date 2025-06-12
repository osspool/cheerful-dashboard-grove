
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { POSInventoryItem } from '../types';
import { sampleInventoryItems } from '@/components/inventory/InventoryData';

// Mock data transformation for POS
const transformInventoryForPOS = (items: any[]): POSInventoryItem[] => {
  return items.map(item => ({
    id: item.id,
    upc: item.upc || `UPC${item.id}`,
    product: {
      id: item.id,
      title: item.title,
      brand: item.brand,
      styleId: item.styleId,
      platform: item.platform || ['external'],
    },
    variant: {
      id: item.id,
      product: item.id,
      styleId: item.styleId,
      stockx: item.stockx ? {
        productId: item.stockx.productId,
        variantId: item.stockx.variantId,
        variantName: item.stockx.variantName,
        variantValue: item.stockx.variantValue,
      } : undefined,
      goat: item.goat ? {
        catalog_id: item.goat.catalog_id,
        size: item.goat.size,
        size_unit: item.goat.size_unit,
      } : undefined,
      general: {
        size: item.size || 'One Size',
        size_unit: 'US',
      },
    },
    quantity: item.quantity,
    retail_price: item.price,
    wholesale_price: item.price * 0.7,
    location: item.location || [],
    platforms_available: item.platform || ['external'],
  }));
};

export const usePOSInventory = (searchQuery: string = '') => {
  return useQuery({
    queryKey: ['pos-inventory', searchQuery],
    queryFn: async () => {
      // Filter sample data based on search query
      let filteredItems = sampleInventoryItems;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredItems = sampleInventoryItems.filter(item => {
          // Access properties safely from the sample data structure
          const title = item.title || '';
          const brand = item.brand || '';
          const styleId = item.styleId || '';
          
          return title.toLowerCase().includes(query) ||
                 brand.toLowerCase().includes(query) ||
                 styleId.toLowerCase().includes(query);
        });
      }
      
      const response = await apiClient.get('/api/pos/inventory', transformInventoryForPOS(filteredItems));
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePOSInventoryByUPC = (upc: string) => {
  return useQuery({
    queryKey: ['pos-inventory-upc', upc],
    queryFn: async () => {
      if (!upc) return null;
      
      // Mock UPC lookup - in real app this would be an API call
      const mockItem = sampleInventoryItems[0]; // Use first item as mock
      if (upc === '194954684154' || upc === mockItem.id) {
        const transformedItems = transformInventoryForPOS([mockItem]);
        const response = await apiClient.get(`/api/pos/inventory/upc/${upc}`, transformedItems[0]);
        return response.data;
      }
      
      throw new Error('Product not found');
    },
    enabled: !!upc,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
