
import { SaleHistoryItem } from './types';

// Generate mock price history data
export const generatePriceHistoryData = () => {
  const data = [];
  const today = new Date();
  for (let i = 365; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a price between $180-$220 with some fluctuation
    const basePrice = 200;
    const variance = Math.sin(i/10) * 20;
    const price = Math.round(basePrice + variance + (Math.random() * 10 - 5));
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: price
    });
  }
  return data;
};

// Mock sales history data
export const mockSalesHistory: SaleHistoryItem[] = [
  { date: "Mar 29, 2023", time: "02:05 PM", size: "6.5Y", price: "$189" },
  { date: "Mar 28, 2023", time: "01:22 PM", size: "6.5Y", price: "$192" },
  { date: "Mar 25, 2023", time: "09:00 AM", size: "6.5Y", price: "$205" },
  { date: "Mar 24, 2023", time: "03:47 AM", size: "6.5Y", price: "$200" },
  { date: "Mar 23, 2023", time: "08:08 PM", size: "6.5Y", price: "$188" },
  { date: "Mar 22, 2023", time: "11:30 AM", size: "6.5Y", price: "$195" },
];
