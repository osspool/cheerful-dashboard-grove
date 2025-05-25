
import React, { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InventoryItemSummary } from './inventory/InventoryItemSummary';
import { InventoryDetailTabs } from './inventory/InventoryDetailTabs';
import { ListingForm } from './inventory/ListingForm';
import { InventoryItem } from './inventory-drawer/types';

interface InventoryDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function InventoryDetailSheet({ open, onOpenChange, item }: InventoryDetailSheetProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedPlatform, setSelectedPlatform] = useState<'stockx' | 'goat' | null>(null);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  
  // Mock listing form state
  const [listingFormData, setListingFormData] = useState({
    price: '',
    condition: 'CONDITION_NEW',
    packagingCondition: 'PACKAGING_CONDITION_GOOD_CONDITION',
    activate: true
  });

  if (!item) return null;
  
  const handleListItem = (platform: 'stockx' | 'goat') => {
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
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-4xl overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Inventory Details</SheetTitle>
            <SheetClose className="p-2 rounded-full hover:bg-secondary">
              <X size={20} />
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="py-6 overflow-y-auto">
          {isListingFormOpen ? (
            <ListingForm 
              selectedPlatform={selectedPlatform}
              item={item}
              selectedVariant={null} // No variant selection needed since each item is one variant
              listingFormData={listingFormData}
              setListingFormData={setListingFormData}
              onBack={() => setIsListingFormOpen(false)}
              onSubmit={handleSubmitListing}
            />
          ) : (
            <>
              <InventoryItemSummary item={item} />
              
              <InventoryDetailTabs 
                item={item} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleListItem={handleListItem} 
              />
            </>
          )}
        </div>
        
        <SheetFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
