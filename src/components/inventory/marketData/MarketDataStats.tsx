
import React from 'react';
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, CircleDollarSign } from 'lucide-react';

interface MarketDataStatsProps {
  platform: string;
  stockXData: any;
  goatData: any;
}

export function MarketDataStats({ platform, stockXData, goatData }: MarketDataStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="border rounded-md p-3 bg-secondary/10">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowDown className="h-4 w-4 text-primary" />
          Lowest Ask
        </div>
        <div className="text-xl font-semibold">
          {platform === 'stockx' 
            ? stockXData?.lowestAskAmount ? `$${stockXData.lowestAskAmount}` : '$--' 
            : goatData && goatData[0] ? formatCurrency(goatData[0].availability.lowest_listing_price_cents) : '$--'}
        </div>
      </div>
      <div className="border rounded-md p-3 bg-secondary/10">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <CircleDollarSign className="h-4 w-4 text-green-500" />
          Highest Bid
        </div>
        <div className="text-xl font-semibold">
          {platform === 'stockx' 
            ? stockXData?.highestBidAmount ? `$${stockXData.highestBidAmount}` : '$--' 
            : goatData && goatData[0] ? formatCurrency(goatData[0].availability.highest_offer_price_cents) : '$--'}
        </div>
      </div>
    </div>
  );
}
