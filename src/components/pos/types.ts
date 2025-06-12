
export interface POSProduct {
  id: string;
  title: string;
  brand: string;
  styleId: string;
  platform: string[];
  stockx?: {
    productId: string;
    styleId: string;
  };
  goat?: {
    catalog_id: string;
    name: string;
    sku: string;
  };
}

export interface POSVariant {
  id: string;
  product: string;
  styleId: string;
  stockx?: {
    productId: string;
    variantId: string;
    variantName: string;
    variantValue: string;
  };
  goat?: {
    catalog_id: string;
    size: number;
    size_unit: string;
  };
  general?: {
    size: string;
    size_unit: string;
  };
}

export interface POSInventoryItem {
  id: string;
  upc: string;
  product: POSProduct;
  variant: POSVariant;
  quantity: number;
  retail_price: number;
  wholesale_price?: number;
  location: string[];
  platforms_available: string[];
}

export interface POSCartItem {
  inventoryItem: POSInventoryItem;
  sellingPrice: number;
  costPrice: number;
  platform: 'stockx' | 'goat' | 'external';
  notes?: string;
}

export interface POSSale {
  id: string;
  items: POSCartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  status: 'completed' | 'pending' | 'returned' | 'partially_returned';
  adjustments?: POSAdjustment[];
}

export interface POSAdjustment {
  id: string;
  saleId: string;
  type: 'refund' | 'discount' | 'return';
  amount: number;
  reason: string;
  createdAt: string;
}
