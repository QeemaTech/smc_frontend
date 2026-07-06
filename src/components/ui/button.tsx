import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_.material-symbols-outlined]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground shadow-elevation-1 hover:shadow-elevation-2 hover:bg-primary/90",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-elevation-1 hover:bg-destructive/90",
        outline:
          "rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-full bg-secondary-container text-secondary-on-container hover:bg-secondary-container/80",
        ghost: "rounded-full hover:bg-accent hover:text-accent-foreground",
        link: "rounded-full text-primary underline-offset-4 hover:underline",
        tonal:
          "rounded-full bg-primary-container text-primary-on-container hover:bg-primary-container/80",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
