import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import { create } from "zustand";

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

type SetPricesValue =
  | ERC20TokenPrices
  | Error
  | ((prevPrices: ERC20TokenPrices | Error) => ERC20TokenPrices | Error);

type TokenPricesStore = {
  prices: ERC20TokenPrices | Error;
  loading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setPrices: (value: SetPricesValue) => void;
};

export const useTokenPricesStore = create<TokenPricesStore>((set) => ({
  prices: EMPTY_TOKEN_PRICES,
  loading: false,
  setPrices: (value) =>
    set((state) => ({
      prices: typeof value === "function" ? value(state.prices) : value,
    })),
  setIsLoading: (isLoading: boolean) => set({ loading: isLoading }),
}));
