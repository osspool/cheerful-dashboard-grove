
import { POSSale, POSCartItem, POSAdjustment } from '../types';

export interface ProfitMetrics {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  adjustmentsTotal: number;
  netProfit: number;
  netProfitMargin: number;
}

export interface SaleProfit {
  saleId: string;
  revenue: number;
  cost: number;
  grossProfit: number;
  adjustments: number;
  netProfit: number;
  profitMargin: number;
  date: string;
}

export const calculateSaleProfit = (sale: POSSale): SaleProfit => {
  // Calculate base revenue and cost from items
  const revenue = sale.items.reduce((sum, item) => sum + item.sellingPrice, 0);
  const cost = sale.items.reduce((sum, item) => sum + item.costPrice, 0);
  const grossProfit = revenue - cost;
  
  // Calculate adjustments impact
  const adjustments = sale.adjustments?.reduce((sum, adj) => {
    switch (adj.type) {
      case 'refund':
      case 'discount':
        return sum - Math.abs(adj.amount); // Negative impact on profit
      case 'return':
        return sum - Math.abs(adj.amount); // Negative impact on profit
      case 'price_adjustment':
        return sum + adj.amount; // Can be positive or negative
      default:
        return sum;
    }
  }, 0) || 0;
  
  const netProfit = grossProfit + adjustments;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  
  return {
    saleId: sale.id,
    revenue,
    cost,
    grossProfit,
    adjustments,
    netProfit,
    profitMargin,
    date: sale.createdAt,
  };
};

export const calculatePeriodMetrics = (sales: POSSale[]): ProfitMetrics => {
  const saleProfits = sales.map(calculateSaleProfit);
  
  const totalRevenue = saleProfits.reduce((sum, sp) => sum + sp.revenue, 0);
  const totalCost = saleProfits.reduce((sum, sp) => sum + sp.cost, 0);
  const grossProfit = totalRevenue - totalCost;
  const adjustmentsTotal = saleProfits.reduce((sum, sp) => sum + sp.adjustments, 0);
  const netProfit = grossProfit + adjustmentsTotal;
  
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  return {
    totalRevenue,
    totalCost,
    grossProfit,
    profitMargin,
    adjustmentsTotal,
    netProfit,
    netProfitMargin,
  };
};

export const getTopPerformingItems = (sales: POSSale[], limit: number = 5) => {
  const itemPerformance = new Map<string, {
    productTitle: string;
    quantity: number;
    revenue: number;
    profit: number;
  }>();
  
  sales.forEach(sale => {
    const saleProfit = calculateSaleProfit(sale);
    sale.items.forEach(item => {
      const key = item.inventoryItem.product.title;
      const existing = itemPerformance.get(key) || {
        productTitle: key,
        quantity: 0,
        revenue: 0,
        profit: 0,
      };
      
      const itemProfit = item.sellingPrice - item.costPrice;
      itemPerformance.set(key, {
        ...existing,
        quantity: existing.quantity + 1,
        revenue: existing.revenue + item.sellingPrice,
        profit: existing.profit + itemProfit,
      });
    });
  });
  
  return Array.from(itemPerformance.values())
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit);
};
