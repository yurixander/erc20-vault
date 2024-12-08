import { Erc20TokenId } from "@/config/types";
import getErc20TokenDef from "@/utils/getErc20TokenDef";
import { useCallback, useEffect, useState } from "react";

type Erc20TokenPrices = Record<Erc20TokenId, number | null> | null;

const EMPTY_CACHED_PRICES: Erc20TokenPrices = {
  [Erc20TokenId.USDC]: null,
  [Erc20TokenId.USDT]: null,
  [Erc20TokenId.DAI]: null,
  [Erc20TokenId.LINK]: null,
  [Erc20TokenId.PEPE]: null,
  [Erc20TokenId.SHIB]: null,
  [Erc20TokenId.BNB]: null,
  [Erc20TokenId.UNI]: null,
  [Erc20TokenId.ARB]: null,
  [Erc20TokenId.WBTC]: null,
  // Testing
  [Erc20TokenId.MTK]: null,
} as const;

const useTokenPrice = () => {
  const [cachedUsdPrices, setCachedUsdPrices] =
    useState<Erc20TokenPrices>(null);

  useEffect(() => {
    if (cachedUsdPrices === null) {
      return;
    }

    const timeoutId = setTimeout(() => setCachedUsdPrices(null), 60000);

    return () => clearTimeout(timeoutId);
  }, [cachedUsdPrices]);

  const getPriceInUsd = useCallback(
    async (erc20TokenId: Erc20TokenId): Promise<number> => {
      const cachedPrice =
        cachedUsdPrices === null
          ? null
          : (cachedUsdPrices[erc20TokenId] ?? null);

      if (cachedPrice !== null) {
        return cachedPrice;
      }

      const currentPrice = await fetchErc20TokenPrice(erc20TokenId);

      setCachedUsdPrices((prevCachedPrices) => {
        if (prevCachedPrices === null) {
          return { ...EMPTY_CACHED_PRICES, [erc20TokenId]: currentPrice };
        }

        return { ...prevCachedPrices, [erc20TokenId]: currentPrice };
      });

      return currentPrice;
    },
    [cachedUsdPrices],
  );

  return {
    getPriceInUsd,
  };
};

enum Currencies {
  USD = "usd",
}

async function fetchErc20TokenPrice(
  erc20TokenId: Erc20TokenId,
  currencies: Currencies = Currencies.USD,
): Promise<number> {
  const { coingeckoId } = getErc20TokenDef(erc20TokenId);
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=${currencies}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }

  const data = await response.json();
  const tokenData = data[coingeckoId];

  if (tokenData === undefined) {
    throw new Error(`The token was not found in coingeko: ${coingeckoId}`);
  }

  return Number(tokenData.usd);
}

export default useTokenPrice;
