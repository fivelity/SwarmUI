import { ReactNode } from 'react';

interface ParameterGroupProps {
  title: string;
  children: ReactNode;
}

export const ParameterGroup = ({ title, children }: ParameterGroupProps) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4 text-accent">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};
