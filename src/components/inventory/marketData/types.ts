
export interface SaleHistoryItem {
  date: string;
  time: string;
  size: string;
  price: string;
}

export interface StockXMarketData {
  productId: string;
  variantId: string;
  currencyCode: string;
  highestBidAmount: string;
  lowestAskAmount: string;
  flexLowestAskAmount: string | null;
}

export interface GoatAvailability {
  lowest_listing_price_cents: string;
  highest_offer_price_cents: string;
  last_sold_listing_price_cents: string;
  global_indicator_price_cents: string;
}

export interface GoatMarketData {
  size: number;
  product_condition: string;
  packaging_condition: string;
  availability: GoatAvailability;
}
