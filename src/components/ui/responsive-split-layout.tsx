
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveSplitLayoutProps {
  leftPanel: {
    content: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
  };
  rightPanel: {
    content: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    badge?: string | number;
  };
  className?: string;
  leftPanelClassName?: string;
  rightPanelClassName?: string;
  defaultMobileView?: 'left' | 'right';
}

export const ResponsiveSplitLayout = ({
  leftPanel,
  rightPanel,
  className,
  leftPanelClassName,
  rightPanelClassName,
  defaultMobileView = 'left'
}: ResponsiveSplitLayoutProps) => {
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'left' | 'right'>(defaultMobileView);

  const showLeft = !isMobile || mobileView === 'left';
  const showRight = !isMobile || mobileView === 'right';

  return (
    <div className={cn("flex h-full", className)}>
      {/* Desktop: Both panels visible, Mobile: Conditional rendering */}
      
      {/* Left Panel */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isMobile ? "w-full" : "flex-1",
        !showLeft && "hidden",
        leftPanelClassName
      )}>
        {leftPanel.content}
      </div>

      {/* Right Panel */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isMobile ? "w-full" : "w-96",
        !showRight && "hidden",
        !isMobile && "border-l",
        rightPanelClassName
      )}>
        {rightPanel.content}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 safe-area-pb">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button
              variant={mobileView === 'left' ? 'default' : 'outline'}
              onClick={() => setMobileView('left')}
              className="flex-1 mr-2"
            >
              {mobileView === 'right' && <ArrowLeft className="h-4 w-4 mr-2" />}
              {leftPanel.icon}
              <span className="ml-2">{leftPanel.title || 'Left'}</span>
            </Button>
            
            <Button
              variant={mobileView === 'right' ? 'default' : 'outline'}
              onClick={() => setMobileView('right')}
              className="flex-1 ml-2 relative"
            >
              <span className="mr-2">{rightPanel.title || 'Right'}</span>
              {rightPanel.icon}
              {mobileView === 'left' && <ArrowRight className="h-4 w-4 ml-2" />}
              {rightPanel.badge && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {rightPanel.badge}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
