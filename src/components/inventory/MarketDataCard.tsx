
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface StockXMarketData {
  productId: string;
  variantId: string;
  currencyCode: string;
  highestBidAmount: string;
  lowestAskAmount: string;
  flexLowestAskAmount: string | null;
}

interface GoatAvailability {
  lowest_listing_price_cents: string;
  highest_offer_price_cents: string;
  last_sold_listing_price_cents: string;
  global_indicator_price_cents: string;
}

interface GoatMarketData {
  size: number;
  product_condition: string;
  packaging_condition: string;
  availability: GoatAvailability;
}

interface MarketDataCardProps {
  stockXData: StockXMarketData | null;
  goatData: GoatMarketData[] | null;
  selectedSize: string;
  isLoading: boolean;
  onClose?: () => void;
}

export function MarketDataCard({ 
  stockXData, 
  goatData, 
  selectedSize, 
  isLoading,
  onClose 
}: MarketDataCardProps) {
  const [activeTab, setActiveTab] = useState('stockx');

  // Get GOAT market data for a specific size
  const getGoatMarketDataForSize = (size: string) => {
    if (!goatData) return null;
    const numericSize = parseFloat(size);
    return goatData.find(item => item.size === numericSize);
  };

  return (
    <Card className="p-4 relative animate-fade-in border shadow-sm w-full">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="font-semibold">Market Data - Size {selectedSize}</h3>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />}
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-secondary/80"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stockx">StockX</TabsTrigger>
          <TabsTrigger value="goat">GOAT</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stockx" className="space-y-4 mt-4">
          {isLoading || !stockXData ? (
            <div className="h-32 flex items-center justify-center">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3 bg-green-50 border-green-100">
                <div className="text-sm text-green-700">Lowest Ask</div>
                <div className="text-xl font-semibold text-green-800">${stockXData.lowestAskAmount}</div>
              </div>
              <div className="border rounded-md p-3 bg-blue-50 border-blue-100">
                <div className="text-sm text-blue-700">Highest Bid</div>
                <div className="text-xl font-semibold text-blue-800">${stockXData.highestBidAmount}</div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="goat" className="space-y-4 mt-4">
          {isLoading || !goatData ? (
            <div className="h-32 flex items-center justify-center">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const data = getGoatMarketDataForSize(selectedSize);
                if (!data) return (
                  <div className="col-span-2 text-center py-6">
                    <p className="text-muted-foreground">No market data available for this size</p>
                  </div>
                );
                
                return (
                  <>
                    <div className="border rounded-md p-3 bg-green-50 border-green-100">
                      <div className="text-sm text-green-700">Lowest Ask</div>
                      <div className="text-xl font-semibold text-green-800">
                        {formatCurrency(data.availability.lowest_listing_price_cents)}
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-blue-50 border-blue-100">
                      <div className="text-sm text-blue-700">Highest Offer</div>
                      <div className="text-xl font-semibold text-blue-800">
                        {formatCurrency(data.availability.highest_offer_price_cents)}
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-purple-50 border-purple-100">
                      <div className="text-sm text-purple-700">Last Sold</div>
                      <div className="text-xl font-semibold text-purple-800">
                        {formatCurrency(data.availability.last_sold_listing_price_cents)}
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-orange-50 border-orange-100">
                      <div className="text-sm text-orange-700">Market Value</div>
                      <div className="text-xl font-semibold text-orange-800">
                        {formatCurrency(data.availability.global_indicator_price_cents)}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
