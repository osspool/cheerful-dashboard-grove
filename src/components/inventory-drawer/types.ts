export interface SizeChart {
  defaultConversion: {
    size: string;
    type: string;
  };
  availableConversions: Array<{
    size: string;
    type: string;
  }>;
}

export interface ProductAttributes {
  color: string | null;
  gender: string | null;
  releaseDate: string | null;
  retailPrice: number | null;
  season: string | null;
  colorway: string | null;
  category: string | null;
  _id: string;
}

export interface InventoryItem {
  id: string;
  upc: string; // UPC is the unique identifier for each inventory item
  name: string;
  styleId: string;
  brand?: string;
  image: string;
  size: string; // This inventory item's specific size
  quantity: number; // Quantity for this specific UPC/size
  dateAdded: string;
  warehouseLocation: string;
  cost: string;
  retailPrice?: number;
  daysListed?: number;
  spread?: number;
  isLowestAsk?: boolean;
  isExpired?: boolean;
  stockx?: {
    sku: string;
    productId?: string;
  };
  goat?: {
    sku: string;
    size_unit?: string;
    catalogId?: string;
    name?: string;
  };
  _id?: string;
  productAttributes?: ProductAttributes;
  platformsAvailable?: string[];
  inventoryAddedAt?: string;
  // Remove variations since each inventory item is for one specific variant
}

// Keep Variant type for product catalog use
export interface Variant {
  _id: string;
  variantId: string;
  variantName: string;
  variantValue: string;
  size: string;
  sizeChart?: SizeChart;
  quantity?: number;
}
