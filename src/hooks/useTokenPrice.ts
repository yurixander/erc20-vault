import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import { useTokenPricesStore } from "@/store/useTokenPriceStore";
import { getErc20TokenDef } from "@/utils/tokens";
import { useCallback, useEffect, useRef } from "react";

export class PricesUnavailableError extends Error {
  message = "No prices available.";
}

export const PRICE_UPDATE_TIME = 360_000;

const useTokenPrice = () => {
  const { prices, loading, updatePrices } = useTokenPricesStore();
  const beforePricesRef = useRef<ERC20TokenPrices | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    const updater = async () => {
      const { newPrices, prevPrices } = await updatePrices();

      // Prioritize a previous error-free state.
      beforePricesRef.current =
        prevPrices instanceof Error ? newPrices : prevPrices;

      if (newPrices instanceof Error) {
        console.error(`Error fetching token prices ${newPrices}`);
      }
    };

    if (prices === null) {
      updater();
    }

    const id = setInterval(updater, PRICE_UPDATE_TIME);
    return () => clearInterval(id);
  }, [loading, updatePrices, prices]);

  const getPriceByTokenId = useCallback(
    (erc20TokenId: Erc20TokenId): number | null => {
      const { isTestToken } = getErc20TokenDef(erc20TokenId);

      if (isTestToken === true) {
        return 0;
      }

      // If prices could not be obtained then use the previous price status.
      const cachedPrices =
        prices instanceof Error ? beforePricesRef.current : prices;

      if (cachedPrices === null) {
        return null;
      }

      return cachedPrices[erc20TokenId] ?? null;
    },
    [prices],
  );

  const getAllPrices = useCallback(():
    | ERC20TokenPrices
    | PricesUnavailableError
    | null => {
    if (prices instanceof Error) {
      if (beforePricesRef.current !== null) {
        return beforePricesRef.current;
      }

      return new PricesUnavailableError();
    }

    return prices;
  }, [prices]);

  return {
    getPriceByTokenId: loading ? null : getPriceByTokenId,
    getAllPrices: loading ? null : getAllPrices,
  };
};

export default useTokenPrice;
