import { useState, ReactNode } from 'react';

interface TabProps {
  label: string;
  children: ReactNode;
}

export const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

export const Tabs = ({ children }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="flex border-b border-border">
        {children.map((child, index) => (
          <button
            key={child.props.label}
            className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 ${activeIndex === index ? 'border-primary text-primary' : 'border-transparent text-text/70 hover:text-text'}`}
            onClick={() => setActiveIndex(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {children[activeIndex]}
      </div>
    </div>
  );
};
