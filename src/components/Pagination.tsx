import * as React from "react";
import { cn } from "@/lib/utils";
import Button, { ButtonProps } from "@/components/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { FC } from "react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));

PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));

PaginationItem.displayName = "PaginationItem";

type PaginationSelector = {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
};

const PaginationSelector: FC<PaginationSelector> = ({
  onClick,
  children,
  isActive,
  className,
}) => (
  <Button
    size="icon"
    onClick={onClick}
    variant={isActive ? "outline" : "ghost"}
    className={className}
  >
    {children}
  </Button>
);

PaginationSelector.displayName = "PaginationSelector";

const PaginationPrevious: FC<ButtonProps> = ({
  variant = "ghost",
  size = "default",
  className,
  children,
  ...props
}) => (
  <Button
    aria-label="Go to previous page"
    size={size}
    variant={variant}
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLeftIcon className="mt-0.5" />
    Previous
  </Button>
);

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext: FC<ButtonProps> = ({
  variant = "ghost",
  size = "default",
  className,
  children,
  ...props
}) => (
  <Button
    aria-label="Go to next page"
    size={size}
    variant={variant}
    className={cn("gap-1", className)}
    {...props}
  >
    Next
    <ChevronRightIcon className="mt-0.5" />
  </Button>
);

PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <DotsHorizontalIcon className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationSelector,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
