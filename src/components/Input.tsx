import * as React from "react";

import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
import Legend from "./Legend";
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
          "flex w-full items-center justify-center gap-2 rounded-md border border-input bg-transparent p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error !== null && "border-red-500",
          className,
        )}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent focus-visible:outline-none"
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
