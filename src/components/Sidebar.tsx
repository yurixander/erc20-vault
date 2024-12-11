import { cn } from "@/lib/utils";
import { FC, useCallback } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { Heading, Text } from "./Typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import useContractReadOnce from "@/hooks/useContractRead";
import VAULT_ABI from "@/abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import BN from "bn.js";
import { Erc20TokenDefinition } from "@/config/types";
import useTokenPrice from "@/hooks/useTokenPrice";
import { getTokenByAddress } from "@/utils/findTokenByAddress";
import { convertBNToAmount } from "@/utils/amount";
import Decimal from "decimal.js";

const TVL_BALANCE = "$345.15M";

const AppSidebar: FC<{ className?: string }> = ({ className }) => {
  const readOnce = useContractReadOnce(VAULT_ABI);
  const { getAllPricesInUsd, getPriceInUsd } = useTokenPrice();

  const fetchTvl = useCallback(async () => {
    const rawDepositors = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDepositors",
      args: [],
    });

    if (rawDepositors instanceof Error) {
      throw rawDepositors;
    }

    const prices = await getAllPricesInUsd();

    if (prices === null) {
      throw new Error("No prices available.");
    }

    const tvl = new BN(0);

    for (const depositor of rawDepositors) {
      const rawDeposit = await readOnce({
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "getDeposits",
        args: [depositor],
      });

      if (rawDeposit instanceof Error) {
        throw new Error(`Error getting deposit for ${depositor}`);
      }

      for (const deposit of rawDeposit) {
        if (deposit.withdrawn) {
          continue;
        }

        const tokenDef = getTokenByAddress(deposit.tokenAddress);

        const priceOfToken =
          prices[tokenDef.id] ?? (await getPriceInUsd(tokenDef.id));

        const depositPrice = priceOfDeposit(
          deposit.amount,
          priceOfToken,
          tokenDef,
        );

        tvl.add(depositPrice);
      }
    }

    return tvl;
  }, [readOnce, getAllPricesInUsd, getPriceInUsd]);

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

function priceOfDeposit(
  rawAmount: bigint,
  priceOfToken: number,
  { decimals }: Erc20TokenDefinition,
): BN {
  const amount = convertBNToAmount(new BN(rawAmount.toString()), decimals);
  const result = new Decimal(amount);

  result.mul(priceOfToken);
  return new BN(result.toFixed(0));
}

export default AppSidebar;
