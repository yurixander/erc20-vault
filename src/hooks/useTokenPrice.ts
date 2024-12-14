import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import {
  EMPTY_TOKEN_PRICES,
  useTokenPricesStore,
} from "@/store/useTokenPriceStore";
import { getErc20TokenDef } from "@/utils/tokens";
import { useCallback, useEffect, useRef } from "react";

const useTokenPrice = (tokens: Erc20TokenId[]) => {
  const { prices, loading, setPrices, setIsLoading } = useTokenPricesStore();
  const pricesRef = useRef(EMPTY_TOKEN_PRICES);

  useEffect(() => {
    if (prices instanceof Error) {
      return;
    }

    pricesRef.current = prices;
  }, [prices]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const updater = async () => {
      setIsLoading(true);

      try {
        const prices = await getTokenPrices(tokens);

        setPrices(prices);
      } catch (error) {
        setPrices(
          error instanceof Error
            ? error
            : new Error("Error getting token prices."),
        );

        console.error(`Error fetching token prices ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    const id = setInterval(updater, 60_000);
    return () => clearInterval(id);
  }, [loading, tokens, setIsLoading, setPrices]);

  const getPriceByTokenId = useCallback(
    async (erc20TokenId: Erc20TokenId): Promise<number> => {
      const cachedPrice = pricesRef.current[erc20TokenId] ?? null;
      const { isTestToken } = getErc20TokenDef(erc20TokenId);

      if (isTestToken === true) {
        return 0;
      }

      if (cachedPrice !== null) {
        return cachedPrice;
      }

      const currentPrice = await fetchErc20TokenPrice(erc20TokenId);

      setPrices({
        ...pricesRef.current,
        [erc20TokenId]: currentPrice,
      });

      return currentPrice;
    },
    [setPrices],
  );

  const getAllPrices =
    useCallback(async (): Promise<ERC20TokenPrices | null> => {
      const cachedPrices = pricesRef.current;

      if (!Object.values(cachedPrices).some((price) => price === null)) {
        return cachedPrices;
      }

      setIsLoading(true);

      try {
        const prices = await getTokenPrices(tokens);
        setPrices(prices);

        return prices;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [setPrices, setIsLoading, tokens]);

  return {
    getPriceByTokenId: loading ? null : getPriceByTokenId,
    getAllPrices: loading ? null : getAllPrices,
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
