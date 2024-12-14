import { FC, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "./Typography";
import VAULT_ABI from "@/abi/vaultAbi";
import { MAINNET_TOKENS, VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import useContractReadOnce from "@/hooks/useContractRead";
import useTokenPrice from "@/hooks/useTokenPrice";
import { getTokenByAddress } from "@/utils/findTokenByAddress";
import BN from "bn.js";
import { Erc20TokenDefinition } from "@/config/types";
import { convertBNToAmount } from "@/utils/amount";
import Decimal from "decimal.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { IoIosInformationCircle } from "react-icons/io";

class PricesUnavailableError extends Error {
  message = "No prices available.";
}

const DisplayTvl: FC = () => {
  const [loading, setIsLoading] = useState(true);
  const [tvl, setTvl] = useState<number | null | Error>(null);
  const readOnce = useContractReadOnce(VAULT_ABI);
  const { getAllPrices, getPriceByTokenId } = useTokenPrice(MAINNET_TOKENS);

  const fetchTvl = useCallback(async () => {
    const allDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getAllDeposits",
      args: [],
    });

    if (allDeposits instanceof Error) {
      throw allDeposits;
    }

    const prices = await getAllPrices?.();

    if (prices === null || prices === undefined) {
      throw new PricesUnavailableError();
    }

    const tvl = new BN(0);

    for (const deposit of allDeposits) {
      if (deposit.withdrawn) {
        continue;
      }

      const tokenDef = getTokenByAddress(deposit.tokenAddress);

      const priceOfToken =
        prices[tokenDef.id] ?? (await getPriceByTokenId?.(tokenDef.id));

      if (priceOfToken === undefined) {
        throw new PricesUnavailableError();
      }

      const depositPrice = priceOfDeposit(
        deposit.amount,
        priceOfToken,
        tokenDef,
      );

      tvl.add(depositPrice);
    }

    return tvl.toNumber();
  }, [readOnce, getAllPrices, getPriceByTokenId]);

  useEffect(() => {
    fetchTvl()
      .then(setTvl)
      .catch((e: Error) => setTvl(e))
      .finally(() => setIsLoading(false));
  }, [fetchTvl]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Heading level="h5" className="w-max text-blue-50">
          TVL
        </Heading>

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

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.span className="select-none font-medium text-blue-50">
              Calculating
            </motion.span>

            <div className="flex space-x-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="size-1 rounded-full bg-blue-50"
                  animate={{ translateY: [1, 4, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : tvl instanceof Error || tvl === null ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center text-blue-50"
          >
            Error: {tvl?.message ?? "No TVL found"}
          </motion.div>
        ) : (
          <motion.div
            key="tvl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-4xl text-blue-50"
          >
            $
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {tvl?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
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

export default DisplayTvl;
