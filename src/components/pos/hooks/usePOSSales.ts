
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { POSSale, POSAdjustment } from '../types';

// Mock sales data with better status handling
const mockSales: POSSale[] = [
  {
    id: 'SALE-001',
    items: [],
    subtotal: 299.99,
    total: 299.99,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'delivered',
    paymentMethod: 'card',
    shippingDetails: {
      trackingNumber: 'TRK123456789',
      carrier: 'UPS',
      shippedAt: new Date(Date.now() - 43200000).toISOString(),
      deliveredAt: new Date(Date.now() - 21600000).toISOString(),
    },
  },
  {
    id: 'SALE-002',
    items: [],
    subtotal: 149.99,
    total: 149.99,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    status: 'confirmed',
    paymentMethod: 'cash',
  },
  {
    id: 'SALE-003',
    items: [],
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
