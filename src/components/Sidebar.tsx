import { cn } from "@/lib/utils";
import { FC } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { Heading, Text } from "./Typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";

const TVL_BALANCE = "$345.15M";

const AppSidebar: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <header className="flex h-16 w-full items-center justify-between px-4 sm:h-20 sm:border-b sm:border-b-blue-200/50 md:h-24 dark:sm:border-b-gray-200/50">
        <div className="size-12 rounded-full bg-blue-100" />

        <div className="h-8 w-24 rounded-md bg-blue-100" />
      </header>

      <div className="grow px-4">
        <div className="flex flex-col gap-y-1 pt-4">
          <div className="flex items-center gap-x-1">
            <Text as="label" htmlFor="tvl" className="w-max text-blue-50">
              TVL
            </Text>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IoIosInformationCircle className="text-blue-50" />
                </TooltipTrigger>

                <TooltipContent>
                  Total value in USD locked in Erc20 Vault
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Heading level="h2" id="tvl" className="text-blue-50">
            {TVL_BALANCE}
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
