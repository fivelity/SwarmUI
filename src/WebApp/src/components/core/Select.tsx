import { ComponentProps } from 'react';

export const Select = (props: ComponentProps<"select">) => {
  return <select {...props} className="bg-secondary border border-border rounded px-2 py-1 w-full" />;
};
