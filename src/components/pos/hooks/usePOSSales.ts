
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { POSSale, POSAdjustment } from '../types';

// Mock sales data
const mockSales: POSSale[] = [
  {
    id: 'SALE-001',
    items: [],
    subtotal: 299.99,
    total: 299.99,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: 'completed',
  },
  {
    id: 'SALE-002',
    items: [],
    subtotal: 149.99,
    total: 149.99,
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    status: 'completed',
  },
];

export const usePOSSales = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['pos-sales', dateRange],
    queryFn: async () => {
      // Filter by date range if provided
      let filteredSales = mockSales;
      
      if (dateRange) {
        filteredSales = mockSales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= dateRange.from && saleDate <= dateRange.to;
        });
      }
      
      const response = await apiClient.get('/api/pos/sales', filteredSales);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePOSSaleById = (saleId: string) => {
  return useQuery({
    queryKey: ['pos-sale', saleId],
    queryFn: async () => {
      const sale = mockSales.find(s => s.id === saleId);
      if (!sale) throw new Error('Sale not found');
      
      const response = await apiClient.get(`/api/pos/sales/${saleId}`, sale);
      return response.data;
    },
    enabled: !!saleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      };
      
      const response = await apiClient.post('/api/pos/sales', newSale);
      return response.data;
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
        amount: 0, // Calculate based on items
        reason,
        createdAt: new Date().toISOString(),
      };
      
      const response = await apiClient.post(`/api/pos/sales/${saleId}/returns`, adjustment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};
