import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { layouts as availableLayouts, defaultLayout, type Layout } from '../layouts/definitions';

// Export layouts for use in other components
export const layouts = availableLayouts;

interface LayoutContextType {
  layout: Layout;
  layouts: Layout[];
  setLayout: (layoutId: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [layout, setLayoutState] = useState<Layout>(defaultLayout);

  useEffect(() => {
    // Load layout from localStorage or use default
    const savedLayoutId = localStorage.getItem('user-layout');
    const savedLayout = savedLayoutId ? availableLayouts.find(l => l.id === savedLayoutId) : null;
    setLayoutState(savedLayout || defaultLayout);
  }, []);

  const setLayout = (layoutId: string) => {
    const newLayout = availableLayouts.find(l => l.id === layoutId);
    if (newLayout) {
      setLayoutState(newLayout);
      localStorage.setItem('user-layout', layoutId);
    }
  };

  return (
    <LayoutContext.Provider value={{ layout, layouts: availableLayouts, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
