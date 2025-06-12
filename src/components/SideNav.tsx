
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  User, 
  Package, 
  ShoppingCart, 
  List, 
  ScanBarcode, 
  PackagePlus,
  Tag, 
  Settings, 
  Star, 
  History,
  LogOut,
  Boxes,
  CreditCard
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => {
  return (
    <Link to={to} className={cn("sidebar-item", isActive && "active")}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export function SideNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="h-screen w-64 bg-sidebar-background text-sidebar-foreground flex flex-col overflow-y-auto animate-slide-in">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard size={18} className="text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">Inventory Hub</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-6">
        <div className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/" isActive={path === "/"} />
          <NavItem icon={User} label="Profile" to="/profile" isActive={path === "/profile"} />
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs uppercase text-muted-foreground font-medium mb-2">Inventory</p>
          <NavItem icon={Package} label="Inventory" to="/inventory" isActive={path === "/inventory"} />
          <NavItem icon={Boxes} label="Products" to="/products" isActive={path.startsWith("/products")} />
          <NavItem icon={ScanBarcode} label="Quick Scanner" to="/scanner" isActive={path === "/scanner"} />
          <NavItem icon={PackagePlus} label="Bulk Add" to="/bulk-add" isActive={path === "/bulk-add"} />
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs uppercase text-muted-foreground font-medium mb-2">Sales</p>
          <NavItem icon={CreditCard} label="Point of Sale" to="/pos" isActive={path === "/pos"} />
          <NavItem icon={ShoppingCart} label="Orders" to="/order" isActive={path === "/order"} />
          <NavItem icon={List} label="Listings" to="/listing" isActive={path === "/listing"} />
          <NavItem icon={Tag} label="Price Rules" to="/price-rule" isActive={path === "/price-rule"} />
        </div>

        <div className="pt-4 space-y-1">
          <p className="px-3 text-xs uppercase text-muted-foreground font-medium mb-2">General</p>
          <NavItem icon={Settings} label="Settings" to="/settings" isActive={path === "/settings"} />
          <NavItem icon={Star} label="Favorites" to="/favorite" isActive={path === "/favorite"} />
          <NavItem icon={History} label="History" to="/history" isActive={path === "/history"} />
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="sidebar-item text-red-400 hover:bg-red-500/10 hover:text-red-500">
          <LogOut size={18} />
          <span>Sign out</span>
        </div>
      </div>
    </div>
  );
}
