
export interface BatchItem {
  upcCode: string;
  productName: string;
  brand?: string;
  color?: string;
  size?: string;
  quantity: number;
  isNewProduct?: boolean;
}

export interface ScannedInventoryItem {
  inventoryId: string;
  upc: string;
  product: {
    title: string;
    brand: string;
    styleId: string;
  };
  variant: {
    stockx?: {
      variantValue: string;
    };
    goat?: {
      size: number;
      size_unit: string;
    };
  };
  currentQuantity: number;
  scannedQuantity: number;
  location: string[];
  retail_price: number;
  platforms_available: string[];
}
