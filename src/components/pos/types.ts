
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
  id: string; // Unique ID for this cart item instance
  inventoryItem: POSInventoryItem;
  sellingPrice: number;
  costPrice: number;
  platform: 'stockx' | 'goat' | 'external';
  notes?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  shippingDetails?: {
    trackingNumber?: string;
    carrier?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  adjustments?: POSItemAdjustment[];
}

export interface POSSale {
  id: string;
  items: POSCartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'partial' | 'completed' | 'cancelled'; // Derived from item statuses
  paymentMethod?: 'cash' | 'card' | 'mixed';
  customerNotes?: string;
  shippingDetails?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface POSItemAdjustment {
  id: string;
  saleId: string;
  itemId: string; // References POSCartItem.id
  type: 'refund' | 'discount' | 'return' | 'price_adjustment';
  amount: number;
  reason: string;
  createdAt: string;
  createdBy?: string;
}

// Legacy adjustment type for backward compatibility
export interface POSAdjustment {
  id: string;
  saleId: string;
  type: 'refund' | 'discount' | 'return' | 'price_adjustment';
  amount: number;
  reason: string;
  createdAt: string;
  createdBy?: string;
}
