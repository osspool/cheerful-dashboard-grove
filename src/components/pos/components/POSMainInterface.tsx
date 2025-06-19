
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, History, RotateCcw } from 'lucide-react';
import { POSResponsiveLayout } from './POSResponsiveLayout';
import { POSSalesHistory } from './POSSalesHistory';

export const POSMainInterface = () => {
  return (
    <Tabs defaultValue="sale" className="h-full flex flex-col">
      <div className="border-b px-6 py-3">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="sale" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            New Sale
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Sales History
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Returns
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-hidden">
        <TabsContent value="sale" className="h-full m-0">
          <POSResponsiveLayout />
        </TabsContent>

        <TabsContent value="history" className="h-full m-0 p-6 overflow-y-auto">
          <POSSalesHistory />
        </TabsContent>

        <TabsContent value="returns" className="h-full m-0 p-6 overflow-y-auto">
          <div className="text-center py-12 text-muted-foreground">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Returns & Refunds</h3>
            <p>Return and refund functionality will be implemented here.</p>
            <p className="text-sm mt-2">This will allow processing returns for completed sales.</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
