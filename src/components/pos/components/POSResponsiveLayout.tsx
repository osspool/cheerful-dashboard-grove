
import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { ResponsiveSplitLayout } from '@/components/ui/responsive-split-layout';
import { POSProductSearch } from './POSProductSearch';
import { POSCart } from './POSCart';
import { usePOS } from '../context/POSContext';

export const POSResponsiveLayout = () => {
  const { state } = usePOS();

  return (
    <ResponsiveSplitLayout
      leftPanel={{
        content: <POSProductSearch />,
        title: "Products",
        icon: <Search className="h-4 w-4" />
      }}
      rightPanel={{
        content: <POSCart />,
        title: "Cart",
        icon: <ShoppingCart className="h-4 w-4" />,
        badge: state.cartItems.length > 0 ? state.cartItems.length : undefined
      }}
      leftPanelClassName="bg-background"
      rightPanelClassName="bg-card/30"
      defaultMobileView="left"
    />
  );
};
