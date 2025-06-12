
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Listing from "./pages/Listing";
import QuickScanner from "./pages/QuickScanner";
import BulkAdd from "./pages/BulkAdd";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import POS from "./pages/POS";
import { QueryProvider } from "./providers/QueryProvider";

const App = () => {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/order" element={<Index />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/scanner" element={<QuickScanner />} />
            <Route path="/bulk-add" element={<BulkAdd />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/price-rule" element={<Index />} />
            <Route path="/settings" element={<Index />} />
            <Route path="/favorite" element={<Index />} />
            <Route path="/history" element={<Index />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryProvider>
  );
};

export default App;
