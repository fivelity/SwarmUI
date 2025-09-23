import { createContext, useContext, useState, ReactNode } from 'react';
import { defaultLayout, compactLayout } from '../layouts/definitions';

interface Layout {
  gridTemplateAreas: string;
  gridTemplateColumns: string;
}

export const layouts = {
  default: defaultLayout,
  compact: compactLayout,
};

interface LayoutContextType {
  layout: Layout;
  setLayout: (layoutName: keyof typeof layouts) => void;
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

  const setLayout = (layoutName: keyof typeof layouts) => {
    setLayoutState(layouts[layoutName]);
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
