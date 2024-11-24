import React, { type FC } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TypographyWeight = "light" | "regular" | "medium" | "semibold" | "bold";
type TypographyAlign = "left" | "center" | "right";

type TypographyColor = "default" | "destructive";

interface TypographyBaseProps<T>
  extends Omit<React.AllHTMLAttributes<T>, "color" | "weight" | "align"> {
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
}

type TypographyVariants = {
  weight: Record<TypographyWeight, string>;
  align: Record<TypographyAlign, string>;
  color: Record<TypographyColor, string>;
};

const typographyClass: TypographyVariants = {
  weight: {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
  align: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  },
  color: {
    default: "text-foreground",
    destructive: "text-red-700 dark:text-red-600",
  },
};

const typographyVariants = cva("w-full", {
  variants: typographyClass,
  defaultVariants: {
    weight: "regular",
    align: "left",
    color: "default",
  },
});

type TextSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type TextAs = "span" | "p" | "div" | "label";

type TextVariants = {
  size: Record<TextSize, string>;
};

const textSizeClass: TextVariants = {
  size: {
    "1": "text-xs",
    "2": "text-xs sm:text-sm",
    "3": "text-sm sm:text-base",
    "4": "text-base sm:text-lg",
    "5": "text-lg sm:text-xl",
    "6": "text-2xl sm:text-3xl",
    "7": "text-3xl sm:text-4xl",
    "8": "text-4xl sm:text-5xl",
  },
};

const textVariants = cva("select-none", {
  variants: textSizeClass,
  defaultVariants: {
    size: "3",
  },
});

export interface TextProps
  extends Omit<TypographyBaseProps<HTMLElement>, "size"> {
  as?: TextAs;
  size?: TextSize;
}

const Text: FC<TextProps> = ({
  as,
  size,
  color,
  weight,
  align,
  className,
  ...props
}) => {
  const Component = as ?? "span";

  return (
    <Component
      className={cn(
        textVariants({ size }),
        typographyVariants({ color, weight, align }),
        className
      )}
      {...props}
    />
  );
};

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingVariants = {
  level: Record<HeadingLevel, string>;
};

const headingClass: HeadingVariants = {
  level: {
    h1: "text-4xl sm:text-5xl",
    h2: "text-2xl sm:text-3xl",
    h3: "text-xl sm:text-2xl",
    h4: "text-lg sm:text-xl",
    h5: "text-base sm:text-lg",
    h6: "text-sm sm:text-base",
  },
};

const headingVariants = cva("select-none font-bold", {
  variants: headingClass,
  defaultVariants: {
    level: "h3",
  },
});

export interface HeadingProps extends TypographyBaseProps<HTMLHeadingElement> {
  level?: HeadingLevel;
}

function Heading({
  color,
  weight,
  align,
  level = "h3",
  className,
  ...props
}: HeadingProps): React.JSX.Element {
  const Component = level;

  return (
    <Component
      className={cn(
        typographyVariants({ color, weight, align }),
        headingVariants({ level }),
        className
      )}
      {...props}
    />
  );
}

export { Text, Heading };
