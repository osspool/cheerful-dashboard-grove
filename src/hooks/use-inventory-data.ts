
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { InventoryItem } from '@/components/inventory-drawer/types';
import { sampleInventoryItems } from '@/components/inventory/InventoryData';
import { toast } from './use-toast';

// Query keys for React Query
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

/**
 * Hook to fetch inventory items
 */
export const useInventoryItems = (searchQuery: string = '', filters: any = null) => {
  return useQuery({
    queryKey: inventoryKeys.list(JSON.stringify({ searchQuery, filters })),
    queryFn: async () => {
      // Use our mock data from InventoryData.ts
      const response = await apiClient.get('/api/inventory', sampleInventoryItems);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single inventory item by ID
 */
export const useInventoryItem = (id: string | undefined) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      
      const item = sampleInventoryItems.find(item => item.id === id);
      if (!item) throw new Error(`Inventory item with ID ${id} not found`);
      
      const response = await apiClient.get(`/api/inventory/${id}`, item);
      return response.data;
    },
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update inventory item quantity
 */
export const useUpdateInventoryQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      newQuantity 
    }: { 
      itemId: string; 
      newQuantity: number 
    }) => {
      // Simulate API call to update quantity for this specific inventory item
      const response = await apiClient.put(`/api/inventory/${itemId}/quantity`, 
        { quantity: newQuantity },
        { success: true }
      );
      return response.data;
    },
    onMutate: async ({ itemId, newQuantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });
      
      // Snapshot the previous value
      const previousInventory = queryClient.getQueryData<InventoryItem[]>(inventoryKeys.lists());
      
      // Optimistically update the inventory
      queryClient.setQueryData<InventoryItem[]>(
        inventoryKeys.lists(),
        (old = []) => {
          return old.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, quantity: newQuantity };
          });
        }
      );
      
      // Also update the specific item query if it exists
      queryClient.setQueryData<InventoryItem>(
        inventoryKeys.detail(itemId),
        (old) => {
          if (!old) return old;
          return { ...old, quantity: newQuantity };
        }
      );
      
      return { previousInventory };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousInventory) {
        queryClient.setQueryData(inventoryKeys.lists(), context.previousInventory);
      }
      toast({
        title: "Error updating quantity",
        description: "There was a problem updating the inventory quantity.",
        variant: "destructive",
      });
    },
    onSuccess: (data, { itemId }) => {
      toast({
        title: "Quantity updated",
        description: `Inventory quantity for item ${itemId} has been updated successfully.`,
      });
    },
    onSettled: (data, error, { itemId }) => {
      // Always refetch after error or success to ensure cache is up to date
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(itemId) });
    },
  });
};
