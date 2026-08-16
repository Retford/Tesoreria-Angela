import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-line bg-stripe text-ink-soft',
        success: 'border-green-600 bg-green-50 text-green-700',
        destructive: 'border-red-600 bg-red-50 text-red-700',
        gold: 'border-gold-600 bg-gold-50 text-forest-700',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
