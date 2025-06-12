
import React from 'react';
import { SideNav } from '@/components/SideNav';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, ShoppingCart } from 'lucide-react';
import { POSContent } from '@/components/pos/POSContent';

const POS = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card/50 px-6 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/pos" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Point of Sale
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-hidden">
          <POSContent />
        </div>
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default POS;
