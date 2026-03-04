import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb87a] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#7cb87a] text-[#18180f] hover:bg-[#8fce8d] active:bg-[#6aa368] font-semibold',
        destructive: 'bg-[#c17a5a]/20 text-[#e09070] hover:bg-[#c17a5a]/30 border border-[#c17a5a]/40',
        outline: 'border border-[#3a3a2a] bg-transparent text-[#c8c4b0] hover:bg-[#2e2e22] hover:text-[#f0ede4]',
        ghost: 'text-[#9a9680] hover:bg-[#2e2e22] hover:text-[#f0ede4]',
        secondary: 'bg-[#2e2e22] text-[#f0ede4] hover:bg-[#3a3a2a]',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
