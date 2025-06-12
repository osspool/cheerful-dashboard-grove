
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { sampleInventoryItems } from '@/components/inventory/InventoryData';

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  costPrice: number;
  quantity: number;
  upc: string;
}

interface Product {
  id: string;
  title: string;
  brand: string;
  image?: string;
  variants: ProductVariant[];
}

// Transform inventory data to product format
const transformInventoryToProducts = (items: any[]): Product[] => {
  const productMap = new Map<string, Product>();

  items.forEach(item => {
    const productKey = `${item.title}-${item.brand}`;
    
    if (!productMap.has(productKey)) {
      productMap.set(productKey, {
        id: productKey,
        title: item.title,
        brand: item.brand,
        variants: [],
      });
    }

    const product = productMap.get(productKey)!;
    
    // Add variant
    product.variants.push({
      id: item.id,
      size: item.size || 'One Size',
      price: item.price,
      costPrice: item.price * 0.7, // 30% margin
      quantity: item.quantity,
      upc: item.upc || `UPC${item.id}`,
    });
  });

  return Array.from(productMap.values());
};

export const usePOSProducts = (searchQuery: string = '') => {
  return useQuery({
    queryKey: ['pos-products', searchQuery],
    queryFn: async () => {
      // Filter sample data based on search query
      let filteredItems = sampleInventoryItems;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredItems = sampleInventoryItems.filter(item => {
          const title = String((item as any).title || '');
          const brand = String((item as any).brand || '');
          const styleId = String((item as any).styleId || '');
          
          return title.toLowerCase().includes(query) ||
                 brand.toLowerCase().includes(query) ||
                 styleId.toLowerCase().includes(query);
        });
      }
      
      const products = transformInventoryToProducts(filteredItems);
      const response = await apiClient.get('/api/pos/products', products);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
