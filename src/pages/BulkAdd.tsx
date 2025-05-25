
import React from 'react';
import { SideNav } from '@/components/SideNav';
import { Toaster } from "@/components/ui/toaster";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, PackagePlus } from 'lucide-react';
import { ScannerContent } from '@/components/scanner/ScannerContent';

const BulkAdd = () => {
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
                <BreadcrumbLink href="/bulk-add" className="flex items-center">
                  <PackagePlus className="h-4 w-4 mr-1" />
                  Bulk Add Inventory
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <ScannerContent />
      </div>
      <Toaster />
    </div>
  );
};

export default BulkAdd;
