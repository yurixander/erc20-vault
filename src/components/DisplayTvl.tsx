import { FC, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "./Typography";
import VAULT_ABI from "@/abi/vaultAbi";
import {
  mainnetPublicClient,
  VAULT_CONTRACT_ADDRESS,
} from "@/config/constants";
import useTokenPrice, { PricesUnavailableError } from "@hooks/useTokenPrice";
import BN from "bn.js";
import { convertBNToAmount } from "@utils/amount";
import Decimal from "decimal.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { IoIosInformationCircle } from "react-icons/io";
import { getTokenByAddress } from "@utils/tokens";
import { ERC20TokenPrices } from "@/config/types";

const DisplayTvl: FC = () => {
  const [loading, setIsLoading] = useState(true);
  const [tvl, setTvl] = useState<number | null | Error>(null);
  const { getAllPrices } = useTokenPrice();

  const fetchTvl = useCallback(async (prices: ERC20TokenPrices) => {
    const allDeposits = await mainnetPublicClient.readContract({
      abi: VAULT_ABI,
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getAllDeposits",
    });

    if (allDeposits instanceof Error) {
      throw allDeposits;
    }

    if (prices === undefined) {
      throw new PricesUnavailableError();
    } else if (prices instanceof PricesUnavailableError) {
      throw prices;
    }

    const tvl = new BN(0);

    for (const deposit of allDeposits) {
      if (deposit.withdrawn) {
        continue;
      }

      const { tokenId, decimals, isTestToken } = getTokenByAddress(
        deposit.tokenAddress,
      );

      const priceOfToken = isTestToken === true ? 0 : (prices[tokenId] ?? null);

      if (priceOfToken === null) {
        throw new PricesUnavailableError();
      }

      const depositPrice = priceOfDeposit(
        deposit.amount,
        priceOfToken,
        decimals,
      );

      tvl.add(depositPrice);
    }

    return tvl.toNumber();
  }, []);

  useEffect(() => {
    const prices = getAllPrices?.();

    if (prices === null || prices === undefined) {
      return;
    }

    if (prices instanceof Error) {
      setIsLoading(false);
      setTvl(prices);

      return;
    }

    fetchTvl(prices)
      .then(setTvl)
      .catch((e: Error) => {
        if (e instanceof PricesUnavailableError) {
          setTvl(e);
        } else {
          console.error(e);

          setTvl(
            new Error("Unexpected error occurred, check your connection."),
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, [fetchTvl, getAllPrices]);

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
            {tvl?.message ?? "No TVL found"}
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
  decimals: number,
): BN {
  const amount = convertBNToAmount(new BN(rawAmount.toString()), decimals);
  const result = new Decimal(amount);

  result.mul(priceOfToken);
  return new BN(result.toFixed(0));
}

export default DisplayTvl;
