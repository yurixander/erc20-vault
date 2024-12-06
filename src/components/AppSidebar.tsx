import { cn } from "@/lib/utils";
import { PopoverArrow } from "@radix-ui/react-popover";
import { FC } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import Popover, { PopoverContent, PopoverTrigger } from "./Popover";
import { Heading, Text } from "./Typography";

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

            <Popover>
              <PopoverTrigger>
                <IoIosInformationCircle className="text-blue-50" />
              </PopoverTrigger>

              <PopoverContent>
                <PopoverArrow className="fill-popover" />
                Total value locked in Erc20 Vault
              </PopoverContent>
            </Popover>
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
