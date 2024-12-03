import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  isLoading?: boolean;
  loadingText?: string;
  rightIcon?: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      asChild = false,
      children,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const Tag = asChild ? Slot : "button";

    // TODO: Make it so that the width between loading and default state changes smoothly instead of jumping, likely using Framer Motion.
    return (
      <Tag
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "space-x-2",
          buttonVariants({ variant, size, className }),
          isLoading && "animate-pulse",
        )}
        {...props}
      >
        {isLoading && <FiLoader className="size-4 animate-spin" />}

        {isLoading ? loadingText : children}

        {!isLoading && rightIcon !== undefined && (
          <div className="ml-2">{rightIcon}</div>
        )}
      </Tag>
    );
  },
);

Button.displayName = "Button";

export default Button;
