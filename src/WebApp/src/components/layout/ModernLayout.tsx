import React from 'react';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
    children: React.ReactNode[];
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    defaultSizes?: number[];
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
    children, 
    className,
    orientation = 'horizontal',
    defaultSizes = [25, 50, 25]
}) => {
    return (
        <div className={cn("h-full w-full bg-background", className)}>
            <ResizablePanelGroup 
                direction={orientation} 
                className="h-full w-full"
            >
                {children.map((child, index) => (
                    <React.Fragment key={index}>
                        <ResizablePanel 
                            defaultSize={defaultSizes[index] || 25}
                            minSize={15}
                            className="relative"
                        >
                            <div className="h-full p-2 overflow-hidden">
                                <div className="glass-card h-full p-4 rounded-lg shadow-soft overflow-auto">
                                    {child}
                                </div>
                            </div>
                        </ResizablePanel>
                        {index < children.length - 1 && (
                            <ResizableHandle withHandle className="bg-border/60 hover:bg-border/80 transition-colors" />
                        )}
                    </React.Fragment>
                ))}
            </ResizablePanelGroup>
        </div>
    );
};

// Specialized layouts for different use cases
export const ThreeColumnLayout: React.FC<{ children: React.ReactNode[] }> = ({ children }) => (
    <ModernLayout defaultSizes={[25, 50, 25]}>{children}</ModernLayout>
);

export const TwoColumnLayout: React.FC<{ children: React.ReactNode[] }> = ({ children }) => (
    <ModernLayout defaultSizes={[40, 60]}>{children}</ModernLayout>
);

export const VerticalLayout: React.FC<{ children: React.ReactNode[] }> = ({ children }) => (
    <ModernLayout orientation="vertical" defaultSizes={[30, 40, 30]}>{children}</ModernLayout>
);

export default ModernLayout;
