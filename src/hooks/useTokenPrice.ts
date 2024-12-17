import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import {
  EMPTY_TOKEN_PRICES,
  useTokenPricesStore,
} from "@/store/useTokenPriceStore";
import { getErc20TokenDef } from "@/utils/tokens";
import { useCallback, useEffect, useRef } from "react";

export class PricesUnavailableError extends Error {
  message = "No prices available.";
}

const PRICE_UPDATE_TIME = 60_000;

const useTokenPrice = (tokens: Erc20TokenId[]) => {
  const { prices, loading, setPrices, setIsLoading } = useTokenPricesStore();
  const beforePricesRef = useRef<ERC20TokenPrices | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    const updater = async () => {
      setIsLoading(true);

      try {
        const prices = await getTokenPrices(tokens);

        setPrices((prevPrices) => {
          // Prioritize a previous error-free state.
          beforePricesRef.current =
            prevPrices instanceof Error ? prices : prevPrices;

          return prices;
        });
      } catch (error) {
        setPrices(new PricesUnavailableError());

        console.error(`Error fetching token prices ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    const id = setInterval(updater, PRICE_UPDATE_TIME);
    return () => clearInterval(id);
  }, [loading, tokens, setIsLoading, setPrices]);

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
    | PricesUnavailableError => {
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

export enum Currencies {
  USD = "usd",
}

export async function fetchErc20TokenPrice(
  erc20TokenId: Erc20TokenId,
  currencies: Currencies = Currencies.USD,
): Promise<number | null> {
  const { coingeckoId } = getErc20TokenDef(erc20TokenId);
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=${currencies}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch price data in coingeko for ${coingeckoId}`);

    return null;
  }

  try {
    const data = await response.json();
    const tokenData = data[coingeckoId];

    if (tokenData === undefined) {
      console.error(`The token was not found in coingeko: ${coingeckoId}`);

      return null;
    }

    return Number(tokenData.usd);
  } catch {
    console.error(
      `An error occurred while getting the json from the response from coingeko.`,
    );

    return null;
  }
}

async function getTokenPrices(
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
    throw new PricesUnavailableError();
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
