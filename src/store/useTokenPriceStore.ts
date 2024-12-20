import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import { create } from "zustand";
import z from "zod";
import { LocalStorageKeys, MAINNET_TOKENS } from "@/config/constants";
import {
  PRICE_UPDATE_TIME,
  PricesUnavailableError,
} from "@/hooks/useTokenPrice";
import { getErc20TokenDef } from "@/utils/tokens";
import { lessThanOfInSeconds } from "@/utils/time";

export const EMPTY_TOKEN_PRICES: ERC20TokenPrices = {
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
  // Test token.
  [Erc20TokenId.MTK]: 0,
};

type TokenPricesStore = {
  prices: ERC20TokenPrices | Error | null;
  loading: boolean;
  updatePrices: () => Promise<{
    prevPrices: ERC20TokenPrices | Error | null;
    newPrices: ERC20TokenPrices | null;
  }>;
};

export const useTokenPricesStore = create<TokenPricesStore>((set, get) => ({
  prices: null,
  loading: false,
  updatePrices: async () => {
    set({ loading: true });

    const prevPrices = get().prices;

    try {
      const prices = await getTokenPrices(MAINNET_TOKENS);
      set({ prices: prices, loading: false });

      return {
        prevPrices,
        newPrices: prices,
      };
    } catch {
      set({ prices: new PricesUnavailableError(), loading: false });

      return {
        prevPrices,
        newPrices: null,
      };
    }
  },
}));

const cachedPricesSchema = z.object({
  prices: z.record(z.nativeEnum(Erc20TokenId), z.number().nullable()),
  lastTimestamp: z.number(),
});

type CachedPrices = {
  prices: ERC20TokenPrices;
  lastTimestamp: number;
};

function getCachedPrices(): CachedPrices | null {
  const data = localStorage.getItem(LocalStorageKeys.CachedPrices);

  if (data === null) {
    return null;
  }

  try {
    const parseJson = JSON.parse(data);
    const rawCachedPrices = cachedPricesSchema.parse(parseJson);

    return {
      lastTimestamp: rawCachedPrices.lastTimestamp,
      prices: Object.values(Erc20TokenId).reduce((acc, tokenId) => {
        acc[tokenId] = rawCachedPrices.prices[tokenId] ?? null;

        return acc;
      }, EMPTY_TOKEN_PRICES),
    };
  } catch {
    return null;
  }
}

function saveCachedPrices(prices: ERC20TokenPrices) {
  const cachedPrices: CachedPrices = {
    lastTimestamp: Date.now(),
    prices,
  };

  localStorage.setItem(
    LocalStorageKeys.CachedPrices,
    JSON.stringify(cachedPrices),
  );
}

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
  // Validity time of local storage data.
  // Avoid re-doing a request if the user reloads the page.
  // Converted to seconds.
  const TIME_FOR_BE_VALID = PRICE_UPDATE_TIME / 1000;
  const cachedPrices = getCachedPrices();

  if (
    cachedPrices !== null &&
    lessThanOfInSeconds(cachedPrices.lastTimestamp, TIME_FOR_BE_VALID)
  ) {
    return cachedPrices.prices;
  } else if (cachedPrices !== null) {
    console.log("For here fetch");

    try {
      const newPrices = await fetchTokenPrices(erc20TokenIds, currencies);
      saveCachedPrices(newPrices);
      return newPrices;
    } catch {
      console.warn(
        "Could not get new prices, cached prices were returned instead.",
      );

      return cachedPrices.prices;
    }
  }

  const newPrices = await fetchTokenPrices(erc20TokenIds, currencies);
  console.log("For here");
  saveCachedPrices(newPrices);

  return newPrices;
}

async function fetchTokenPrices(
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
