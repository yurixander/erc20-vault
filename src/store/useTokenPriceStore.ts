import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import { create } from "zustand";
import z from "zod";
import { LocalStorageKeys, MAINNET_TOKENS } from "@/config/constants";
import { getTokenPrices, PricesUnavailableError } from "@/hooks/useTokenPrice";

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
  prices: ERC20TokenPrices | Error;
  loading: boolean;
  updatePrices: () => Promise<{
    prevPrices: ERC20TokenPrices | Error;
    newPrices: ERC20TokenPrices | null;
  }>;
};

export const useTokenPricesStore = create<TokenPricesStore>((set, get) => ({
  prices: EMPTY_TOKEN_PRICES,
  loading: false,
  updatePrices: async () => {
    console.log("Update prices");
    set({ loading: true });

    const cachedPrices = getAvailableCachedPrices();
    const prevPrices = get().prices;

    try {
      const prices = cachedPrices ?? (await getTokenPrices(MAINNET_TOKENS));

      set({ prices: prices, loading: false });

      if (cachedPrices === null) {
        saveCachedPrices(prices);
      }

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

// Validity time of local storage data.
// Avoid re-doing a request if the user reloads the page.
const TIME_FOR_BE_VALID = 70_000;

export function getAvailableCachedPrices(): ERC20TokenPrices | null {
  const cachedPrices = getCachedPrices();

  if (
    cachedPrices === null ||
    cachedPrices.lastTimestamp + TIME_FOR_BE_VALID < Date.now()
  ) {
    return null;
  }

  return Object.values(Erc20TokenId).reduce((acc, tokenId) => {
    acc[tokenId] = cachedPrices.prices[tokenId] ?? null;

    return acc;
  }, EMPTY_TOKEN_PRICES);
}

const cachedPricesSchema = z.object({
  prices: z.record(z.nativeEnum(Erc20TokenId), z.number().nullable()),
  lastTimestamp: z.number(),
});

type CachedPrices = z.infer<typeof cachedPricesSchema>;

function getCachedPrices(): CachedPrices | null {
  const data = localStorage.getItem(LocalStorageKeys.CachedPrices);

  if (data === null) {
    return null;
  }

  const result = cachedPricesSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
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
