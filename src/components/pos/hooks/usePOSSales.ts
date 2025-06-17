
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApiClient, SalesOrder, LocalStatus, ListOrdersParams } from '@/utils/salesApiClient';
import { POSSale, POSAdjustment } from '../types';

// Helper function to convert SalesOrder to POSSale format for backward compatibility
const convertSalesOrderToPOSSale = (order: SalesOrder): POSSale => {
  return {
    id: order._id,
    items: [{
      id: `item-${order._id}`,
      inventoryItem: {
        id: order.inventoryId as string,
        upc: '123456789012', // This would come from populated inventory data
        product: {
          id: order.product.productId as string,
          title: order.product.name,
          brand: order.product.brand || '',
          styleId: order.product.styleId || '',
          platform: [order.platform],
        },
        variant: {
          id: `var-${order._id}`,
          product: order.product.productId as string,
          styleId: order.product.styleId || '',
          general: {
            size: order.product.size || '',
            size_unit: 'US',
          },
        },
        quantity: order.quantity,
        retail_price: order.soldPrice,
        wholesale_price: order.costPrice,
        location: ['warehouse-1'],
        platforms_available: [order.platform],
      },
      sellingPrice: order.soldPrice,
      costPrice: order.costPrice,
      platform: order.platform,
      status: mapLocalStatusToItemStatus(order.localStatus),
      adjustments: order.customAdjustments?.map(adj => ({
        id: `adj-${Date.now()}-${Math.random()}`,
        saleId: order._id,
        type: adj.type as POSAdjustment['type'],
        amount: adj.amount,
        reason: adj.description || '',
        createdAt: order.updatedAt,
      })) || [],
      shippingDetails: order.shipping ? {
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrierCode,
        shippedAt: order.shipping.shippedAt,
      } : undefined,
    }],
    subtotal: order.soldPrice,
    total: order.payout?.totalPayout || order.soldPrice,
    createdAt: order.createdAt,
    status: mapLocalStatusToSaleStatus(order.localStatus),
    paymentMethod: 'external', // Since these are platform orders
    notes: order.notes,
  };
};

const mapLocalStatusToItemStatus = (localStatus: LocalStatus): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' => {
  switch (localStatus) {
    case 'PENDING_VERIFICATION':
    case 'VERIFIED':
    case 'INVENTORY_ALLOCATED':
      return 'pending';
    case 'READY_TO_SHIP':
      return 'confirmed';
    case 'SHIPPED':
      return 'shipped';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'delivered';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const mapLocalStatusToSaleStatus = (localStatus: LocalStatus): 'pending' | 'completed' | 'partial' | 'cancelled' => {
  switch (localStatus) {
    case 'PENDING_VERIFICATION':
    case 'VERIFIED':
    case 'INVENTORY_ALLOCATED':
    case 'READY_TO_SHIP':
      return 'pending';
    case 'SHIPPED':
      return 'partial';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'cancelled';
    default:
      return 'pending';
  }
};

export const usePOSSales = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['pos-sales', dateRange],
    queryFn: async () => {
      const params: ListOrdersParams = {
        page: 1,
        limit: 100,
        defaultPopulate: true,
      };

      const response = await salesApiClient.listOrders(params);
      
      let filteredOrders = response.docs;
      
      if (dateRange) {
        filteredOrders = response.docs.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dateRange.from && orderDate <= dateRange.to;
        });
      }
      
      // Convert to POSSale format for backward compatibility
      return filteredOrders.map(convertSalesOrderToPOSSale);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePOSSaleById = (saleId: string) => {
  return useQuery({
    queryKey: ['pos-sale', saleId],
    queryFn: async () => {
      const response = await salesApiClient.getOrderById(saleId, 'inventoryId,product.productId');
      return convertSalesOrderToPOSSale(response.data);
    },
    enabled: !!saleId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: Omit<POSSale, 'id' | 'createdAt'>) => {
      // For backward compatibility, create a local sale record
      const newSale: POSSale = {
        ...saleData,
        id: `SALE-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      console.log('Creating local sale:', newSale);
      return newSale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};

export const useCreateOrderFromPlatform = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      platform: 'stockx' | 'goat';
      platformOrderId: string;
      inventoryId: string;
      productData: any;
      costPrice: number;
      soldPrice: number;
      payout: any;
      notes?: string;
    }) => {
      const createOrderRequest = {
        platform: orderData.platform,
        platformOrderId: orderData.platformOrderId,
        inventoryId: orderData.inventoryId,
        product: {
          productId: orderData.productData.productId,
          name: orderData.productData.name,
          brand: orderData.productData.brand,
          styleId: orderData.productData.styleId,
          size: orderData.productData.size,
        },
        costPrice: orderData.costPrice,
        soldPrice: orderData.soldPrice,
        payout: orderData.payout,
        platformStatus: 'COMPLETED',
        soldAt: new Date().toISOString(),
        notes: orderData.notes,
      };

      const response = await salesApiClient.createOrder(createOrderRequest);
      console.log('Created platform order:', response.data);
      return response.data;
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
      // Map POSSale status to LocalStatus
      const localStatus: LocalStatus = status === 'completed' ? 'COMPLETED' :
                                     status === 'partial' ? 'SHIPPED' :
                                     status === 'cancelled' ? 'CANCELLED' : 'PENDING_VERIFICATION';

      const response = await salesApiClient.updateOrderStatus(
        saleId, 
        localStatus, 
        shippingDetails ? `Tracking: ${shippingDetails.trackingNumber}` : undefined
      );
      
      console.log('Updated order status:', response.data);
      return response.data;
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
      // For now, just log the adjustment - in a real app this would call the backend
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
      const response = await salesApiClient.updateOrderStatus(saleId, 'REFUNDED', `Return: ${reason}`);
      console.log('Processing return:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-sales'] });
    },
  });
};
