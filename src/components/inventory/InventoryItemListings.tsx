import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, ListOrdered } from 'lucide-react';
import { StockXListings, StockXListing } from './StockXListings';
import { GoatListings, GoatListing } from './GoatListings';
import { InventoryListingsHeader } from './InventoryListingsHeader';

interface InventoryItemListingsProps {
  styleId: string;
  name: string;
}

export function InventoryItemListings({ styleId, name }: InventoryItemListingsProps) {
  const [activeTab, setActiveTab] = useState('stockx');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const mockStockXListings: StockXListing[] = [
    {
      amount: "148",
      ask: {
        askId: "14632361809866143310",
        askCreatedAt: "2025-04-10T19:30:56.000Z",
        askUpdatedAt: "2025-04-10T19:30:56.000Z",
        askExpiresAt: "2026-04-10T19:30:46.000Z"
      },
      order: null,
      product: {
        productId: "3414f48d-e8bf-463f-9e6b-9d8520a202b9",
        productName: "Timberland 6\" Boot Black Nubuck Premium",
        styleId: styleId,
      },
      variant: {
        variantId: "7f70b1d5-f9a2-4eff-af46-b19c3a68af5e",
        variantName: "Timberland-6-Black-Nubuck:9",
        variantValue: "9"
      },
      currencyCode: "USD",
      listingId: "f9c5e3f5-0762-4a9d-aebb-e74a2cdca53d",
      status: "ACTIVE",
      inventoryType: "STANDARD",
      createdAt: "2025-04-10T19:30:55.251Z",
      updatedAt: "2025-04-10T19:31:00.225Z",
      authenticationDetails: null,
      batch: {
        batchId: "52591f34-524e-42b1-a571-133ad0f6574e",
        taskId: "c34445fb-9730-4ce1-b7b6-20439351cc50"
      },
      initiatedShipments: null,
      price: "148.00"
    },
    {
      amount: "155",
      ask: {
        askId: "14632361809866143311",
        askCreatedAt: "2025-04-12T14:20:16.000Z",
        askUpdatedAt: "2025-04-12T14:20:16.000Z",
        askExpiresAt: "2026-04-12T14:20:16.000Z"
      },
      order: null,
      product: {
        productId: "3414f48d-e8bf-463f-9e6b-9d8520a202b9",
        productName: "Timberland 6\" Boot Black Nubuck Premium",
        styleId: styleId,
      },
      variant: {
        variantId: "8f70b1d5-f9a2-4eff-af46-b19c3a68af5e",
        variantName: "Timberland-6-Black-Nubuck:10",
        variantValue: "10"
      },
      currencyCode: "USD",
      listingId: "g9c5e3f5-0762-4a9d-aebb-e74a2cdca53d",
      status: "ACTIVE",
      inventoryType: "STANDARD",
      createdAt: "2025-04-12T14:20:16.251Z",
      updatedAt: "2025-04-12T14:20:20.225Z",
      authenticationDetails: null,
      batch: {
        batchId: "52591f34-524e-42b1-a571-133ad0f6574e",
        taskId: "c34445fb-9730-4ce1-b7b6-20439351cc50"
      },
      initiatedShipments: null
    }
  ];

  const mockGoatListings: GoatListing[] = [
    {
      id: "019553af-bc11-7893-9b5b-591785703a49",
      catalog_id: "air-jordan-13-retro-wheat-2023-414571-171",
      condition: "CONDITION_NEW",
      packaging_condition: "PACKAGING_CONDITION_GOOD_CONDITION",
      size: "9",
      size_unit: "SIZE_UNIT_US",
      sku: styleId,
      consigned: false,
      created_at: "2025-03-01T21:49:40.323Z",
      updated_at: "2025-04-05T02:29:48.904Z",
      status: "LISTING_STATUS_ACTIVE",
      price_cents: "14000",
      activated_at: "2025-04-05T02:29:48.902Z",
      defects: [],
      additional_defects: ""
    },
    {
      id: "119553af-bc11-7893-9b5b-591785703b50",
      catalog_id: "air-jordan-13-retro-wheat-2023-414571-171",
      condition: "CONDITION_NEW",
      packaging_condition: "PACKAGING_CONDITION_GOOD_CONDITION",
      size: "10",
      size_unit: "SIZE_UNIT_US",
      sku: styleId,
      consigned: false,
      created_at: "2025-03-05T10:23:15.323Z",
      updated_at: "2025-04-07T08:15:22.904Z",
      status: "LISTING_STATUS_ACTIVE",
      price_cents: "15000",
      activated_at: "2025-04-07T08:15:22.902Z",
      defects: [],
      additional_defects: ""
    }
  ];

  const lastUpdated = new Date().toISOString();

  return (
    <div className="space-y-4">
      <InventoryListingsHeader 
        styleId={styleId}
        name={name}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stockx" className="flex items-center gap-2">
            <Package size={16} />
            StockX Listings
            <Badge variant="secondary" className="ml-1">
              {mockStockXListings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="goat" className="flex items-center gap-2">
            <ListOrdered size={16} />
            GOAT Listings
            <Badge variant="secondary" className="ml-1">
              {mockGoatListings.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stockx" className="mt-4">
          <StockXListings 
            listings={mockStockXListings} 
            lastUpdated={lastUpdated} 
            isLoading={isLoading}
            filterByVariantId=""
          />
        </TabsContent>
        
        <TabsContent value="goat" className="mt-4">
          <GoatListings 
            listings={mockGoatListings} 
            lastUpdated={lastUpdated} 
            isLoading={isLoading}
            filterBySize=""
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
