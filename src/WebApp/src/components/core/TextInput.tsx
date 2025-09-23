import { ComponentProps } from 'react';

export const TextInput = (props: ComponentProps<"input">) => {
  return <input {...props} className="bg-secondary border border-border rounded px-2 py-1 w-full" />;
};
