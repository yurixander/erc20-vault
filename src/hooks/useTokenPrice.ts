import { Erc20TokenId } from "@/config/types";
import { getErc20TokenDef } from "@/utils/tokens";
import { useCallback, useEffect } from "react";
import { ERC20TokenPrices } from "@/config/types";
import { create } from "zustand";

const EMPTY_TOKEN_PRICES: ERC20TokenPrices = {
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
  [Erc20TokenId.MTK]: 0,
} as const;

type TokenPricesStore = {
  cachedUsdPrices: ERC20TokenPrices | null;
  setCachedUsdPrices: (cachedUsdPrices: ERC20TokenPrices | null) => void;
};

const useTokenPricesStore = create<TokenPricesStore>((set) => ({
  cachedUsdPrices: null,
  setCachedUsdPrices: (cachedUsdPrices) => set({ cachedUsdPrices }),
}));

const useTokenPrice = (tokens: Erc20TokenId[]) => {
  const { cachedUsdPrices, setCachedUsdPrices } = useTokenPricesStore();

  useEffect(() => {
    if (cachedUsdPrices === null) {
      return;
    }

    const timeoutId = setTimeout(() => setCachedUsdPrices(null), 70000);

    return () => clearTimeout(timeoutId);
  }, [cachedUsdPrices, setCachedUsdPrices]);

  useEffect(() => {
    if (cachedUsdPrices !== null) {
      return;
    }

    getTokenPrices(tokens)
      .then(setCachedUsdPrices)
      .catch((error) => {
        console.error(`Error getting token prices ${error}`);

        setCachedUsdPrices(null);
      });
  }, [cachedUsdPrices, setCachedUsdPrices, tokens]);

  const getPriceInUsd = useCallback(
    async (erc20TokenId: Erc20TokenId): Promise<number> => {
      const { isTestToken } = getErc20TokenDef(erc20TokenId);

      if (isTestToken === true) {
        return 0;
      }

      const cachedPrice =
        cachedUsdPrices === null
          ? null
          : (cachedUsdPrices[erc20TokenId] ?? null);

      if (cachedPrice !== null) {
        return cachedPrice;
      }

      const currentPrice = await fetchErc20TokenPrice(erc20TokenId);

      setCachedUsdPrices({
        ...EMPTY_TOKEN_PRICES,
        [erc20TokenId]: currentPrice,
      });

      return currentPrice;
    },
    [cachedUsdPrices, setCachedUsdPrices],
  );

  const getAllPricesInUsd =
    useCallback(async (): Promise<ERC20TokenPrices | null> => {
      if (cachedUsdPrices !== null) {
        return cachedUsdPrices;
      }

      try {
        const prices = await getTokenPrices(tokens);

        setCachedUsdPrices(prices);

        return prices;
      } catch {
        return null;
      }
    }, [cachedUsdPrices, setCachedUsdPrices, tokens]);

  return {
    getPriceInUsd,
    getAllPricesInUsd,
  };
};

export enum Currencies {
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

export async function getTokenPrices(
  erc20TokenIds: Erc20TokenId[],
  currencies: Currencies = Currencies.USD,
): Promise<ERC20TokenPrices> {
  const tokenPrices = EMPTY_TOKEN_PRICES;
  const erc20TokenDefs = erc20TokenIds.map(getErc20TokenDef);
  const coingeckoIds = erc20TokenDefs.map((def) => def.coingeckoId).join(",");

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=${currencies}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }

  for (const { coingeckoId, tokenId } of erc20TokenDefs) {
    const erc20TokenData = data[coingeckoId];

    if (erc20TokenData === undefined || erc20TokenData.usd === undefined) {
      console.error(`No USD price for ${coingeckoId}`);

      continue;
    }

    tokenPrices[tokenId] = Number(erc20TokenData.usd);
  }

  return tokenPrices;
}

export default useTokenPrice;
