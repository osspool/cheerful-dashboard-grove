
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, History, RotateCcw } from 'lucide-react';
import { POSProductSearch } from './POSProductSearch';
import { POSOrderManagement } from './POSOrderManagement';
import { POSSalesHistory } from './POSSalesHistory';

export const POSMainInterface = () => {
  return (
    <Tabs defaultValue="orders" className="h-full flex flex-col">
      <div className="border-b px-6 py-3">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Order Management
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Order History
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Returns & Adjustments
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-hidden">
        <TabsContent value="orders" className="h-full m-0">
          <div className="flex h-full">
            {/* Product Selection Side */}
            <div className="flex-1 border-r bg-background">
              <POSProductSearch />
            </div>
            
            {/* Order Management Side */}
            <div className="w-96 bg-card/30">
              <POSOrderManagement />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="h-full m-0 p-6 overflow-y-auto">
          <POSSalesHistory />
        </TabsContent>

        <TabsContent value="returns" className="h-full m-0 p-6 overflow-y-auto">
          <div className="text-center py-12 text-muted-foreground">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Returns & Adjustments</h3>
            <p>Process returns and adjustments for existing orders.</p>
            <p className="text-sm mt-2">This matches StockX/GOAT's order adjustment workflows.</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
