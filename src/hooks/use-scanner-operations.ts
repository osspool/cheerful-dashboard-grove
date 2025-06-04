
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';

interface ScanResult {
  status: string;
  message: string;
  data?: {
    inventory: {
      _id: string;
      upc: string;
      product: {
        _id: string;
        title: string;
        brand: string;
        styleId: string;
        platform: string[];
      };
      variant: {
        stockx?: {
          productId: string;
          variantId: string;
          variantName: string;
          variantValue: string;
          sizeChart: any;
        };
        goat?: {
          catalog_id: string;
          size: number;
          size_unit: string;
        };
        _id: string;
        styleId: string;
      };
      quantity: number;
      location: string[];
      retail_price: number;
      platforms_available: string[];
      inventory_added_at: string;
      createdAt: string;
      updatedAt: string;
      id: string;
      __v: number;
    };
  };
}

interface UpdateQuantitiesRequest {
  updates: Array<{
    inventoryId: string;
    quantity: number;
  }>;
  operation: 'increment' | 'decrement';
}

export const useScannerOperations = () => {
  const scanBarcode = async (upc: string): Promise<ScanResult> => {
    // Mock data for testing - replace with actual API call
    if (upc === '194954684154') {
      return {
        status: 'success',
        message: 'Inventory item found',
        data: {
          inventory: {
            _id: '68324736b5e7c35393253c64',
            upc: '194954684154',
            __v: 0,
            createdAt: '2025-05-24T22:24:55.220Z',
            id: '6664',
            inventory_added_at: '2025-01-22T18:00:00.000Z',
            location: ['WC3'],
            platforms_available: ['stockx', 'goat'],
            product: {
              _id: '6832472aeb7b99ad7087081f',
              title: "Nike Air Max 90 Valentine's Day (2021) (Women's)",
              brand: 'Nike',
              styleId: 'DD8029-100',
              platform: ['stockx', 'goat']
            },
            quantity: 1,
            retail_price: 150,
            updatedAt: '2025-05-31T09:29:46.790Z',
            variant: {
              stockx: {
                productId: '7c5474f7-5318-4b7c-96ba-786951a4d095',
                variantId: '1672546e-9dde-43f6-af31-361bcd00235c',
                variantName: 'Nike-Air-Max-90-Valentines-Day-2021-W:16',
                variantValue: '13W',
                sizeChart: {
                  defaultConversion: {
                    size: '13W',
                    type: 'us w'
                  },
                  availableConversions: [
                    {
                      size: 'US W 13',
                      type: 'us w'
                    },
                    {
                      size: 'UK 10.5',
                      type: 'uk'
                    },
                    {
                      size: 'CM 30',
                      type: 'cm'
                    }
                  ]
                }
              },
              goat: {
                catalog_id: 'wmns-air-max-90-valentine-s-day-dd8029-100',
                size: 13,
                size_unit: 'SIZE_UNIT_US'
              },
              _id: '6832472bb5e7c35393253c50',
              styleId: 'DD8029-100'
            }
          }
        }
      };
    }
    
    // Simulate API call for other UPCs
    const response = await apiClient.get(`/api/inventory/scan/${upc}`, {
      status: 'error',
      message: 'Inventory item not found'
    });
    
    return response.data;
  };

  const updateQuantitiesMutation = useMutation({
    mutationFn: async (data: UpdateQuantitiesRequest) => {
      const response = await apiClient.post(
        '/api/inventory/scan/update-quantities',
        data,
        { success: true, message: 'Quantities updated successfully' }
      );
      return response.data;
    }
  });

  return {
    scanBarcode,
    updateInventoryQuantities: updateQuantitiesMutation.mutateAsync,
    isLoading: updateQuantitiesMutation.isPending
  };
};
