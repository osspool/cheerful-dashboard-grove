import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { POSSale, POSAdjustment } from '../types';

// Mock sales data with item-level status tracking
const mockSales: POSSale[] = [
  {
    id: 'SALE-001',
    items: [
      {
        id: 'item-001-1',
        inventoryItem: {
          id: 'inv-001',
          upc: '123456789012',
          product: {
            id: 'prod-001',
            title: 'Air Jordan 1 Retro High OG',
            brand: 'Nike',
            styleId: 'AJ1-001',
            platform: ['stockx', 'goat'],
          },
          variant: {
            id: 'var-001',
            product: 'prod-001',
            styleId: 'AJ1-001',
            stockx: {
              productId: 'stockx-001',
              variantId: 'var-001',
              variantName: 'Size',
              variantValue: '10.5',
            },
          },
          quantity: 1,
          retail_price: 299.99,
          wholesale_price: 180.00,
          location: ['A1'],
          platforms_available: ['stockx', 'goat'],
        },
        sellingPrice: 299.99,
        costPrice: 180.00,
        platform: 'stockx',
        status: 'delivered',
        shippingDetails: {
          trackingNumber: 'TRK123456789',
          carrier: 'UPS',
          shippedAt: new Date(Date.now() - 43200000).toISOString(),
          deliveredAt: new Date(Date.now() - 21600000).toISOString(),
        },
        adjustments: [],
      },
    ],
    subtotal: 299.99,
    total: 299.99,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    paymentMethod: 'card',
  },
  {
    id: 'SALE-002',
    items: [
      {
        id: 'item-002-1',
        inventoryItem: {
          id: 'inv-002',
          upc: '123456789013',
          product: {
            id: 'prod-002',
            title: 'Yeezy Boost 350 V2',
            brand: 'Adidas',
            styleId: 'YZY-350',
            platform: ['stockx', 'goat'],
          },
          variant: {
            id: 'var-002',
            product: 'prod-002',
            styleId: 'YZY-350',
            general: {
              size: '9',
              size_unit: 'US',
            },
          },
          quantity: 1,
          retail_price: 149.99,
          wholesale_price: 90.00,
          location: ['B2'],
          platforms_available: ['stockx', 'goat'],
        },
        sellingPrice: 149.99,
        costPrice: 90.00,
        platform: 'goat',
        status: 'confirmed',
        adjustments: [],
      },
      {
        id: 'item-002-2',
        inventoryItem: {
          id: 'inv-003',
          upc: '123456789014',
          product: {
            id: 'prod-003',
            title: 'Nike Dunk Low',
            brand: 'Nike',
            styleId: 'DUNK-LOW',
            platform: ['stockx'],
          },
          variant: {
            id: 'var-003',
            product: 'prod-003',
            styleId: 'DUNK-LOW',
            general: {
              size: '8.5',
              size_unit: 'US',
            },
          },
          quantity: 1,
          retail_price: 110.00,
          wholesale_price: 70.00,
          location: ['C1'],
          platforms_available: ['stockx'],
        },
        sellingPrice: 110.00,
        costPrice: 70.00,
        platform: 'stockx',
        status: 'shipped',
        shippingDetails: {
          trackingNumber: 'TRK987654321',
          carrier: 'FedEx',
          shippedAt: new Date(Date.now() - 21600000).toISOString(),
        },
        adjustments: [],
      },
    ],
    subtotal: 259.99,
    total: 259.99,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    status: 'partial',
    paymentMethod: 'cash',
  },
  {
    id: 'SALE-003',
    items: [
      {
        id: 'item-003-1',
        inventoryItem: {
          id: 'inv-004',
          upc: '123456789015',
          product: {
            id: 'prod-004',
            title: 'Off-White x Nike Air Force 1',
            brand: 'Nike',
            styleId: 'OW-AF1',
            platform: ['stockx', 'goat'],
          },
          variant: {
            id: 'var-004',
            product: 'prod-004',
            styleId: 'OW-AF1',
            general: {
              size: '11',
              size_unit: 'US',
            },
          },
          quantity: 1,
          retail_price: 89.99,
          wholesale_price: 50.00,
          location: ['A3'],
          platforms_available: ['stockx', 'goat'],
        },
        sellingPrice: 89.99,
        costPrice: 50.00,
        platform: 'external',
        status: 'pending',
        adjustments: [],
      },
    ],
    subtotal: 89.99,
    total: 89.99,
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    status: 'pending',
    paymentMethod: 'card',
  },
];

export const usePOSSales = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['pos-sales', dateRange],
    queryFn: async () => {
      let filteredSales = mockSales;
      
      if (dateRange) {
        filteredSales = mockSales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= dateRange.from && saleDate <= dateRange.to;
        });
      }
      
      return filteredSales;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePOSSaleById = (saleId: string) => {
  return useQuery({
    queryKey: ['pos-sale', saleId],
    queryFn: async () => {
      const sale = mockSales.find(s => s.id === saleId);
      if (!sale) throw new Error('Sale not found');
      return sale;
    },
    enabled: !!saleId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: Omit<POSSale, 'id' | 'createdAt'>) => {
      const newSale: POSSale = {
        ...saleData,
        id: `SALE-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending', // Always start as pending
      };
      
      console.log('Creating sale:', newSale);
      return newSale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};

export const useUpdateSaleStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      saleId, 
      status, 
      shippingDetails 
    }: {
      saleId: string;
      status: POSSale['status'];
      shippingDetails?: POSSale['shippingDetails'];
    }) => {
      const updatedSale = {
        saleId,
        status,
        shippingDetails,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating sale status:', updatedSale);
      return updatedSale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};

export const useAddSaleAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      saleId,
      type,
      amount,
      reason,
    }: {
      saleId: string;
      type: POSAdjustment['type'];
      amount: number;
      reason: string;
    }) => {
      const adjustment: POSAdjustment = {
        id: `ADJ-${Date.now()}`,
        saleId,
        type,
        amount,
        reason,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Adding sale adjustment:', adjustment);
      return adjustment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};

export const useProcessReturn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ saleId, items, reason }: {
      saleId: string;
      items: string[];
      reason: string;
    }) => {
      const adjustment: POSAdjustment = {
        id: `ADJ-${Date.now()}`,
        saleId,
        type: 'return',
        amount: 0,
        reason,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Processing return:', adjustment);
      return adjustment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};
