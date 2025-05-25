
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Package, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductDetailContentProps {
  productId: string;
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock product data
  const product = {
    id: productId,
    title: 'Air Jordan 1 Retro High OG "Bred Toe"',
    brand: 'Jordan',
    styleId: 'AJ1-BRED-TOE',
    productAttributes: {
      color: 'Black/Red/White',
      gender: 'Men',
      category: 'Basketball',
      retailPrice: 170,
      releaseDate: '2018-02-24',
      colorway: 'Bred Toe'
    },
    platforms: ['stockx', 'goat'],
    variants: [
      { size: '7', inventory: 3, platforms: ['stockx', 'goat'] },
      { size: '8', inventory: 5, platforms: ['stockx', 'goat'] },
      { size: '9', inventory: 7, platforms: ['stockx', 'goat'] },
      { size: '10', inventory: 12, platforms: ['stockx', 'goat'] },
      { size: '11', inventory: 8, platforms: ['stockx', 'goat'] },
      { size: '12', inventory: 4, platforms: ['stockx', 'goat'] }
    ]
  };

  const totalInventory = product.variants.reduce((sum, variant) => sum + variant.inventory, 0);

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/products')}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{product.brand}</Badge>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-sm">{product.styleId}</span>
              </div>
            </div>
          </div>
          <Button className="gap-2">
            <Edit size={16} />
            Edit Product
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="variants">Variants & Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package size={18} />
                    Inventory Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">{totalInventory}</div>
                    <div className="text-sm text-muted-foreground">Total units in stock</div>
                    <div className="text-sm">
                      {product.variants.length} size variants available
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Color:</span>
                    <span>{product.productAttributes.color}</span>
                    
                    <span className="text-muted-foreground">Gender:</span>
                    <span>{product.productAttributes.gender}</span>
                    
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.productAttributes.category}</span>
                    
                    <span className="text-muted-foreground">Retail Price:</span>
                    <span>${product.productAttributes.retailPrice}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {product.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="justify-center">
                        {platform.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Size Variants & Inventory Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {product.variants.map((variant) => (
                    <Card key={variant.size} className="text-center">
                      <CardContent className="p-4">
                        <div className="text-lg font-semibold">US {variant.size}</div>
                        <div className="text-2xl font-bold text-primary">{variant.inventory}</div>
                        <div className="text-xs text-muted-foreground">units</div>
                        <div className="flex gap-1 mt-2 justify-center">
                          {variant.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Market Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Market analytics data will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
