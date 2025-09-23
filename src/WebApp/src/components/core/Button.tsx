import { ComponentProps } from 'react';

export const Button = (props: ComponentProps<"button">) => {
  return <button {...props} className={`bg-primary text-white font-bold py-2 px-4 rounded ${props.className}`} />;
};
