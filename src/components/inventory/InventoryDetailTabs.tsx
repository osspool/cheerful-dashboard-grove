
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItemDetails } from './InventoryItemDetails';
import { InventoryItemListings } from './InventoryItemListings';
import { InventoryItemMarketplace } from './InventoryItemMarketplace';
import { InventoryItem } from '../inventory-drawer/types';

interface InventoryDetailTabsProps {
  item: InventoryItem;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleListItem: (platform: 'stockx' | 'goat', variantId?: string) => void;
}

export function InventoryDetailTabs({
  item,
  activeTab,
  setActiveTab,
  handleListItem
}: InventoryDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid grid-cols-3 mb-6 bg-secondary/10">
        <TabsTrigger 
          value="details" 
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Details
        </TabsTrigger>
        <TabsTrigger 
          value="listings"
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Listings
        </TabsTrigger>
        <TabsTrigger 
          value="marketplace"
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Marketplace
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4">
        <InventoryItemDetails item={item} />
      </TabsContent>
      
      <TabsContent value="listings" className="space-y-4">
        <InventoryItemListings
          styleId={item.styleId}
          name={item.name}
        />
      </TabsContent>
      
      <TabsContent value="marketplace" className="space-y-4">
        <InventoryItemMarketplace
          item={item}
          handleListItem={handleListItem}
        />
      </TabsContent>
    </Tabs>
  );
}
