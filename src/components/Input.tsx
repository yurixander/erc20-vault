import * as React from "react";

import { cn } from "@/lib/utils";
import Legend from "./Legend";
import { ReactNode, FC } from "react";
import { Text } from "./Typography";

export type InputProps = {
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  legend?: string;
  legendLearnMoreHref?: string;
  rightElement?: ReactNode;
  className?: string;
  error: string | null;
  value?: string;
  setValue?: (newValue: string) => void;
};

const Input: FC<InputProps> = ({
  className,
  legend,
  legendLearnMoreHref,
  rightElement,
  type = "text",
  placeholder = "Type some text...",
  value,
  error,
  setValue,
}) => {
  return (
    <div className="flex flex-col items-start justify-center gap-1">
      <div
        className={cn(
          "flex items-center justify-center gap-2 w-full rounded-md border border-input bg-transparent p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error !== null && "border-red-500",
          className
        )}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="w-full focus-visible:outline-none"
          value={value}
          onChange={(e) => setValue?.(e.target.value)}
        />

        {rightElement}
      </div>

      {legend !== undefined && error === null && (
        <Legend linkHref={legendLearnMoreHref}>{legend}</Legend>
      )}

      {error !== null && (
        <Text size="1" className="text-red-500">
          {error}
        </Text>
      )}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
