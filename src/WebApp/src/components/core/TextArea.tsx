import { ComponentProps } from 'react';

export const TextArea = (props: ComponentProps<"textarea">) => {
  return <textarea {...props} className="bg-secondary border border-border rounded px-2 py-1 w-full" />;
};
