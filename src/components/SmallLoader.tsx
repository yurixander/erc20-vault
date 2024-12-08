import { FC } from "react";
import { twMerge } from "tailwind-merge";

const SmallLoader: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "mt-1 mr-0.5 size-4 animate-spin rounded-full border-[3px] border-gray-100 border-t-black dark:border-gray-600 dark:border-t-white",
      )}
    />
  );
};

export default SmallLoader;
