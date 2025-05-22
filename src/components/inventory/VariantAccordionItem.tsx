
import React, { useState } from 'react';
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, LineChart, Eye, Tag, Truck } from 'lucide-react';
import { InventoryQuantityControl } from './InventoryQuantityControl';
import { Variant as InventoryVariant } from '@/components/inventory-drawer/types';

interface SizeChart {
  defaultConversion: {
    size: string;
    type: string;
  };
  availableConversions: Array<{
    size: string;
    type: string;
  }>;
}

interface Variant {
  _id: string;
  variantId: string;
  variantName: string;
  variantValue: string;
  size: string;
  sizeChart?: SizeChart;
  quantity?: number;
}

interface VariantAccordionItemProps {
  variant: Variant;
  onListItem: (platform: 'stockx' | 'goat', variantId: string) => void;
  onViewMarketData: (variant: Variant) => void;
  onViewListings: (variant: Variant) => void;
  onQuantityChange?: (variantId: string, newQuantity: number) => void;
  itemId?: string;
}

export function VariantAccordionItem({ 
  variant, 
  onListItem, 
  onViewMarketData,
  onViewListings,
  onQuantityChange,
  itemId = '1'
}: VariantAccordionItemProps) {
  const [activeTab, setActiveTab] = useState<'conversions' | 'actions'>('actions');
  
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AccordionItem 
      value={variant.variantId} 
      className="border rounded-lg mb-2 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-secondary/5 [&[data-state=open]]:bg-secondary/10">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-secondary/30 text-foreground border-secondary">
              Size {variant.size}
            </Badge>
            
            <div className="ml-2" onClick={handleStopPropagation}>
              <InventoryQuantityControl 
                initialQuantity={variant.quantity || 1}
                variantId={variant.variantId}
                onQuantityChange={onQuantityChange}
                itemId={itemId}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2" onClick={handleStopPropagation}>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 bg-secondary/40 text-foreground hover:bg-secondary hover:text-foreground border-secondary"
              onClick={() => onViewMarketData(variant)}
            >
              <LineChart size={14} />
              Market Data
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-primary/20"
              onClick={() => onViewListings(variant)}
            >
              <Eye size={14} />
              Listings
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="border-t bg-background/50">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'conversions' | 'actions')} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-secondary/10 mb-3">
              <TabsTrigger value="actions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Quick Actions</TabsTrigger>
              <TabsTrigger value="conversions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Size Conversions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="actions" className="pt-2">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1.5 w-full bg-secondary/20 text-foreground hover:bg-secondary hover:text-foreground border-secondary/30"
                  onClick={() => onListItem('stockx', variant.variantId)}
                >
                  <Tag size={14} />
                  List on StockX
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1.5 w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-primary/20"
                  onClick={() => onListItem('goat', variant.variantId)}
                >
                  <Truck size={14} />
                  List on GOAT
                </Button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="border rounded-md p-3 bg-secondary/10">
                  <span className="text-muted-foreground block mb-1">StockX:</span>
                  <Badge variant="outline" className="bg-secondary/20">0 active</Badge>
                </div>
                <div className="border rounded-md p-3 bg-secondary/10">
                  <span className="text-muted-foreground block mb-1">GOAT:</span>
                  <Badge variant="outline" className="bg-secondary/20">0 active</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="conversions">
              {variant.sizeChart ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {variant.sizeChart.availableConversions.map((conversion, idx) => (
                    <div key={idx} className="border rounded-md p-3 text-sm bg-secondary/10 hover:bg-secondary/20 transition-colors">
                      <span className="text-primary font-medium">{conversion.type.toUpperCase()}: </span>
                      <span className="font-semibold text-foreground">{conversion.size}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-sm text-muted-foreground border rounded-md bg-secondary/5">
                  No size conversion information available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
