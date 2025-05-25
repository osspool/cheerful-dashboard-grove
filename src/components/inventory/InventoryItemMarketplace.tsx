
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Package, ListOrdered, ChevronDown, Edit, ChevronLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ListingForm } from './ListingForm';
import { useToast } from '@/hooks/use-toast';

interface InventoryItemMarketplaceProps {
  item: any;
  handleListItem: (platform: 'stockx' | 'goat', variantId?: string) => void;
}

export function InventoryItemMarketplace({ item, handleListItem }: InventoryItemMarketplaceProps) {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<'stockx' | 'goat' | null>(null);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [listingFormData, setListingFormData] = useState({
    price: '',
    condition: 'CONDITION_NEW',
    packagingCondition: 'PACKAGING_CONDITION_GOOD_CONDITION',
    activate: true
  });

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleCreateListing = (platform: 'stockx' | 'goat') => {
    setSelectedPlatform(platform);
    setIsListingFormOpen(true);
    
    // Reset form data
    setListingFormData({
      price: '',
      condition: 'CONDITION_NEW',
      packagingCondition: 'PACKAGING_CONDITION_GOOD_CONDITION',
      activate: true
    });
  };

  const handleSubmitListing = () => {
    toast({
      title: "Listing submitted",
      description: `Successfully listed on ${selectedPlatform?.toUpperCase()} for $${listingFormData.price}`,
    });
    setIsListingFormOpen(false);
    setSelectedPlatform(null);
  };

  const handleBackToMarketplace = () => {
    setIsListingFormOpen(false);
    setSelectedPlatform(null);
  };

  if (isListingFormOpen && selectedPlatform) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={handleBackToMarketplace}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Marketplace
          </Button>
        </div>
        
        <ListingForm 
          selectedPlatform={selectedPlatform}
          item={item}
          selectedVariant={null}
          listingFormData={listingFormData}
          setListingFormData={setListingFormData}
          onBack={handleBackToMarketplace}
          onSubmit={handleSubmitListing}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                StockX
              </CardTitle>
              <Badge variant={item.stockx?.sku ? "default" : "outline"}>
                {item.stockx?.sku ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <p className="font-medium">{item.stockx?.sku || "Not available"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Product ID:</span>
                  <p className="font-medium truncate" title={item.stockx?.productId}>
                    {item.stockx?.productId ? item.stockx.productId.substring(0, 12) + "..." : "Not available"}
                  </p>
                </div>
              </div>
              
              {item.stockx?.sku && (
                <Collapsible className="border p-3 rounded-md mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">StockX API Reference</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-2">
                    <div className="bg-secondary/10 p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre>
                        GET /v2/catalog/{item.stockx?.productId}<br />
                        Authorization: Bearer YOUR_API_KEY
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <div className="pt-2">
                <p className="text-sm mb-3">
                  {item.stockx?.sku 
                    ? "This product is connected to StockX. You can list variants directly."
                    : "Connect this product to StockX to enable direct listing."
                  }
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleCreateListing('stockx')}
              className="w-full gap-1.5"
              disabled={!item.stockx?.sku}
              variant={item.stockx?.sku ? "default" : "outline"}
            >
              {item.stockx?.sku ? (
                <>
                  <Package size={16} />
                  List on StockX
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Connect to StockX
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <ListOrdered className="h-5 w-5 mr-2" />
                GOAT
              </CardTitle>
              <Badge variant={item.goat?.sku ? "default" : "outline"}>
                {item.goat?.sku ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <p className="font-medium">{item.goat?.sku || "Not available"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Size Unit:</span>
                  <p className="font-medium">{item.goat?.size_unit?.replace('SIZE_UNIT_', '') || "Not available"}</p>
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground text-sm">Catalog ID:</span>
                <p className="font-medium text-sm overflow-hidden text-ellipsis">{item.goat?.catalogId || "Not available"}</p>
              </div>
              
              {item.goat?.sku && (
                <Collapsible className="border p-3 rounded-md mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">GOAT API Reference</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-2">
                    <div className="bg-secondary/10 p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre>
                        POST /api/v1/listings<br/>
                        catalogId: {item.goat?.catalogId}<br/>
                        priceCents: PRICE<br/>
                        condition: CONDITION_NEW<br/>
                        size: {item.size}<br/>
                        sizeUnit: {item.goat?.size_unit}
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <div className="pt-2">
                <p className="text-sm mb-3">
                  {item.goat?.sku 
                    ? "This product is connected to GOAT. You can list variants directly."
                    : "Connect this product to GOAT to enable direct listing."
                  }
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleCreateListing('goat')}
              className="w-full gap-1.5"
              disabled={!item.goat?.sku}
              variant={item.goat?.sku ? "default" : "outline"}
            >
              {item.goat?.sku ? (
                <>
                  <ListOrdered size={16} />
                  List on GOAT
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Connect to GOAT
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Listing History Section */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Recent Listing Activity</h3>
        <div className="border rounded-md overflow-hidden">
          <div className="bg-secondary/10 px-4 py-3 flex font-medium text-sm">
            <div className="w-24">Date</div>
            <div className="w-16">Platform</div>
            <div className="flex-1">Size</div>
            <div className="w-20">Price</div>
            <div className="w-24">Status</div>
          </div>
          
          {/* Sample recent activity - this would come from API in real implementation */}
          <div className="divide-y">
            <div className="px-4 py-3 flex items-center text-sm">
              <div className="w-24 text-muted-foreground">5/14/2025</div>
              <div className="w-16">StockX</div>
              <div className="flex-1">US 9.5</div>
              <div className="w-20 font-medium">$175.00</div>
              <div className="w-24">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="px-4 py-3 flex items-center text-sm">
              <div className="w-24 text-muted-foreground">5/12/2025</div>
              <div className="w-16">GOAT</div>
              <div className="flex-1">US 10</div>
              <div className="w-20 font-medium">$185.00</div>
              <div className="w-24">
                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                  Pending
                </Badge>
              </div>
            </div>
            
            <div className="px-4 py-3 flex items-center text-sm">
              <div className="w-24 text-muted-foreground">5/10/2025</div>
              <div className="w-16">StockX</div>
              <div className="flex-1">US 8</div>
              <div className="w-20 font-medium">$165.00</div>
              <div className="w-24">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                  Sold
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
