import { apiClient, ApiResponse } from './apiClient';

export interface SalesOrder {
  _id: string;
  platform: 'stockx' | 'goat';
  platformOrderId: string;
  inventoryId: string | any;
  product: {
    productId: string | any;
    name: string;
    brand?: string;
    styleId?: string;
    size?: string;
    platformProductId?: string;
    catalogId?: string;
  };
  costPrice: number;
  soldPrice: number;
  payout?: {
    salePrice: number;
    totalAdjustments: number;
    totalPayout: number;
    currencyCode: string;
    adjustments: Adjustment[];
  };
  customAdjustments?: Adjustment[];
  platformStatus: string;
  localStatus: LocalStatus;
  quantity: number;
  shipping?: {
    carrierCode?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippingLabelUrl?: string;
    shipByDate?: string;
    shippedAt?: string;
  };
  soldAt: string;
  verifiedAt?: string;
  shippedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
  organization: string;
  createdBy?: string;
  lastSyncedAt?: string;
  profit: number;
  profitMargin: number;
  createdAt: string;
  updatedAt: string;
}

export interface Adjustment {
  type: 'Transaction Fee' | 'Payment Processing' | 'Shipping Fee' | 'Bulk Shipping Discount' | 'Authentication Fee' | 'Platform Fee' | 'Custom Adjustment' | 'Other';
  amount: number;
  percentage?: number;
  description?: string;
}

export type LocalStatus = 
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'INVENTORY_ALLOCATED'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderLookupResponse {
  success: boolean;
  platform: 'stockx' | 'goat';
  platformOrderId: string;
  orderData: {
    platform: 'stockx' | 'goat';
    platformOrderId: string;
    inventoryId: string;
    product: {
      productId: string;
      name: string;
      brand: string;
      styleId: string;
      size: string;
      catalogId?: string;
    };
    soldPrice: number;
    payout: {
      salePrice: number;
      totalPayout: number;
      totalAdjustments: number;
      currencyCode: string;
      adjustments: Adjustment[];
    };
    platformStatus: string;
    soldAt: string;
    inventoryInfo: {
      upc: string;
      availableQuantity: number;
      retailPrice: number;
      location: string[];
    };
  } | null;
  status: 'READY_TO_CREATE' | 'PRODUCT_FOUND_NO_INVENTORY' | 'ORDER_NOT_FOUND';
  message: string;
}

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  platform?: 'stockx' | 'goat';
  localStatus?: LocalStatus;
  platformStatus?: string;
  defaultPopulate?: boolean;
  populate?: string;
}

export interface ListOrdersResponse {
  success: boolean;
  docs: SalesOrder[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface CreateOrderRequest {
  platform: 'stockx' | 'goat';
  platformOrderId: string;
  inventoryId: string;
  product: {
    productId: string;
    name: string;
    brand: string;
    styleId: string;
    size: string;
  };
  costPrice: number;
  soldPrice: number;
  payout?: {
    salePrice: number;
    totalAdjustments: number;
    totalPayout: number;
    currencyCode: string;
    adjustments: Adjustment[];
  };
  platformStatus: string;
  soldAt: string;
  notes?: string;
}

export const salesApiClient = {
  // Lookup order from platform with inventory matching
  async lookupPlatformOrder(platform: 'stockx' | 'goat', platformOrderId: string): Promise<OrderLookupResponse> {
    // Mock implementation - replace with actual API call
    const mockOrderData = {
      platform,
      platformOrderId,
      inventoryId: `inv-${Date.now()}`,
      product: {
        productId: `prod-${Date.now()}`,
        name: `${platform === 'stockx' ? 'StockX' : 'GOAT'} Order Item`,
        brand: 'Nike',
        styleId: 'DQ8426-100',
        size: platform === 'stockx' ? '9' : '10.5',
        catalogId: platform === 'goat' ? 'nike-air-jordan-1' : undefined,
      },
      soldPrice: 180.00,
      payout: {
        salePrice: 180.00,
        totalPayout: 154.80,
        totalAdjustments: -25.20,
        currencyCode: 'USD',
        adjustments: [
          {
            type: 'Transaction Fee' as const,
            amount: -12.60,
            percentage: 7,
            description: 'Transaction Fee (7%)'
          },
          {
            type: 'Payment Processing' as const,
            amount: -5.40,
            percentage: 3,
            description: 'Payment Proc. (3%)'
          }
        ]
      },
      platformStatus: 'COMPLETED',
      soldAt: new Date().toISOString(),
      inventoryInfo: {
        upc: '123456789012',
        availableQuantity: 1,
        retailPrice: 180.00,
        location: ['warehouse-1']
      }
    };

    const response = await apiClient.get(
      `/api/sales/orders/platform/${platform}/${platformOrderId}`,
      {
        success: true,
        platform,
        platformOrderId,
        orderData: mockOrderData,
        status: 'READY_TO_CREATE' as const,
        message: 'Order data ready for creation'
      }
    );

    // Return the response data directly since it matches OrderLookupResponse
    return response.data;
  },

  // Create new order
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<SalesOrder>> {
    const mockOrder: SalesOrder = {
      _id: `order-${Date.now()}`,
      platform: orderData.platform,
      platformOrderId: orderData.platformOrderId,
      inventoryId: orderData.inventoryId,
      product: orderData.product,
      costPrice: orderData.costPrice,
      soldPrice: orderData.soldPrice,
      payout: orderData.payout,
      platformStatus: orderData.platformStatus,
      localStatus: 'PENDING_VERIFICATION',
      quantity: 1,
      soldAt: orderData.soldAt,
      profit: (orderData.payout?.totalPayout || orderData.soldPrice) - orderData.costPrice,
      profitMargin: 0,
      organization: 'org-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: orderData.notes
    };

    mockOrder.profitMargin = (mockOrder.profit / mockOrder.soldPrice) * 100;

    return apiClient.post('/api/sales/orders', orderData, mockOrder);
  },

  // List orders with pagination and filtering
  async listOrders(params: ListOrdersParams = {}): Promise<ListOrdersResponse> {
    const mockOrders: SalesOrder[] = [
      {
        _id: 'order-001',
        platform: 'stockx',
        platformOrderId: '75464238-75363997',
        inventoryId: 'inv-001',
        product: {
          productId: 'prod-001',
          name: 'Nike React Element 55 Spruce Volt',
          brand: 'Nike',
          styleId: 'BQ6166-009',
          size: '8'
        },
        costPrice: 80,
        soldPrice: 128,
        payout: {
          salePrice: 128,
          totalAdjustments: -13.6,
          totalPayout: 114.4,
          currencyCode: 'USD',
          adjustments: []
        },
        platformStatus: 'COMPLETED',
        localStatus: 'SHIPPED',
        quantity: 1,
        soldAt: new Date(Date.now() - 86400000).toISOString(),
        profit: 34.4,
        profitMargin: 30.1,
        organization: 'org-123',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const response = await apiClient.get('/api/sales/orders', {
      success: true,
      docs: mockOrders,
      totalDocs: mockOrders.length,
      limit: params.limit || 10,
      page: params.page || 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null
    });

    // Return the response data directly since it matches ListOrdersResponse
    return response.data;
  },

  // Get order by ID
  async getOrderById(id: string, populate?: string): Promise<ApiResponse<SalesOrder>> {
    const mockOrder: SalesOrder = {
      _id: id,
      platform: 'stockx',
      platformOrderId: '75464238-75363997',
      inventoryId: 'inv-001',
      product: {
        productId: 'prod-001',
        name: 'Nike React Element 55 Spruce Volt',
        brand: 'Nike',
        styleId: 'BQ6166-009',
        size: '8'
      },
      costPrice: 80,
      soldPrice: 128,
      platformStatus: 'COMPLETED',
      localStatus: 'SHIPPED',
      quantity: 1,
      soldAt: new Date().toISOString(),
      profit: 48,
      profitMargin: 37.5,
      organization: 'org-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return apiClient.get(`/api/sales/orders/${id}`, mockOrder);
  },

  // Update order status
  async updateOrderStatus(id: string, localStatus: LocalStatus, notes?: string): Promise<ApiResponse<Partial<SalesOrder>>> {
    const mockUpdate = {
      _id: id,
      localStatus,
      notes,
      updatedAt: new Date().toISOString()
    };

    return apiClient.put(`/api/sales/orders/${id}/status`, { localStatus, notes }, mockUpdate);
  }
};
