import { cn } from "@/lib/utils";
import { FC } from "react";
import { Heading, Text } from "./Typography";
import { IoIosInformationCircle } from "react-icons/io";
import Popover, { PopoverContent, PopoverTrigger } from "./Popover";
import { PopoverArrow } from "@radix-ui/react-popover";

const TVL_BALANCE = "$345.15M";

const AppSidebar: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <header className="flex px-4 items-center justify-between h-16 sm:h-20 md:h-24 sm:border-b sm:border-b-blue-200/50 dark:sm:border-b-gray-200/50 w-full">
        <div className="size-12 bg-blue-100 rounded-full" />

        <div className="w-24 h-8 rounded-md bg-blue-100" />
      </header>

      <div className="grow px-4">
        <div className="flex flex-col gap-y-1 pt-4">
          <div className="flex gap-x-1 items-center">
            <Text as="label" htmlFor="tvl" className="text-blue-50 w-max">
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
