import { cn } from "@utils/utils";
import { FC, useEffect, useState } from "react";
import { IoMdTrendingUp, IoMdTrendingDown, IoMdLocate } from "react-icons/io";
import BN from "bn.js";
import useTokenPrice from "@hooks/useTokenPrice";
import { Address } from "viem";
import { getTokenByAddress } from "@utils/tokens";
import { calculateProfitInUsd } from "@utils/amount";
import { motion, AnimatePresence } from "framer-motion";

const DepositProfitGenerator: FC<{
  initialPrice: BN;
  tokenAddress: Address;
  className?: string;
}> = ({ initialPrice, tokenAddress }) => {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setIsLoading] = useState(false);
  const { getPriceByTokenId } = useTokenPrice();

  useEffect(() => {
    if (getPriceByTokenId === null) {
      return;
    }

    const { tokenId, isTestToken } = getTokenByAddress(tokenAddress);

    if (isTestToken) {
      setPercentage(0);

      return;
    }

    setIsLoading(true);

    const currentPrice = getPriceByTokenId?.(tokenId) ?? null;
    if (currentPrice === null) {
      setPercentage(null);
      setIsLoading(false);

      return;
    }

    setPercentage(calculateProfitInUsd(initialPrice, currentPrice));
    setIsLoading(false);
  }, [tokenAddress, getPriceByTokenId, initialPrice]);

  return (
    <div className="flex min-h-8 w-[88px] items-center justify-center space-x-1 rounded-md px-2 py-1 text-neutral-800 text-sm">
      <AnimatePresence mode="wait">
        {loading || getPriceByTokenId === null ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingDots />
          </motion.div>
        ) : percentage === null ? (
          <motion.span
            key="unavailable"
            className="select-none font-medium text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Unavailable
          </motion.span>
        ) : (
          <motion.div
            key="percentage"
            className={cn(
              "flex items-center space-x-1",
              percentage < 0
                ? "text-red-800 selection:bg-red-300"
                : percentage > 0
                  ? "text-green-800 selection:bg-green-300"
                  : "text-neutral-800 selection:bg-neutral-300",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {percentage > 0 ? (
              <IoMdTrendingUp className="size-4" />
            ) : percentage < 0 ? (
              <IoMdTrendingDown className="size-4" />
            ) : (
              <IoMdLocate className="size-4" />
            )}
            <b>{percentage.toFixed(2)}%</b>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingDots: FC = () => {
  return (
    <div className="flex space-x-1">
      <motion.div
        className="size-1 rounded-full bg-current"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.2 }}
      />

      <motion.div
        className="size-1 rounded-full bg-current"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1,
          delay: 0.2,
          repeatDelay: 0.2,
        }}
      />

      <motion.div
        className="size-1 rounded-full bg-current"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1,
          delay: 0.4,
          repeatDelay: 0.2,
        }}
      />
    </div>
  );
};

export default DepositProfitGenerator;
