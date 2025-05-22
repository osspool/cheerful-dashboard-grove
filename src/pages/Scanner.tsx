
import React, { useState, useRef, useEffect } from 'react';
import { SideNav } from '@/components/SideNav';
import { Toaster } from "@/components/ui/toaster";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Scan } from 'lucide-react';
import { ScannerContent } from '@/components/scanner/ScannerContent';

const Scanner = () => {
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
                <BreadcrumbLink href="/scanner" className="flex items-center">
                  <Scan className="h-4 w-4 mr-1" />
                  Barcode Scanner
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

export default Scanner;
