import BN from "bn.js";
import { Address } from "viem";

export type ERC20TokenPrices = Record<Erc20TokenId, number | null>;

export type Deposit = {
  depositId: bigint;
  tokenAddress: `0x${string}`;
  amount: BN;
  initialPrice: BN;
  startTimestamp: number;
  unlockTimestamp: number;
};

// Use strings to avoid unnecessary filtering with Object.values.
export enum Erc20TokenId {
  USDC = "0",
  USDT = "1",
  DAI = "2",
  LINK = "3",
  PEPE = "4",
  SHIB = "5",
  BNB = "6",
  UNI = "7",
  ARB = "8",
  WBTC = "9",
  // Testing
  MTK = "10",
}

export enum CoingekoId {
  USDC = "usd-coin",
  USDT = "tether",
  DAI = "dai",
  LINK = "chainlink",
  PEPE = "pepe",
  SHIB = "shiba-inu",
  BNB = "binancecoin",
  UNI = "uniswap",
  ARB = "arbitrum",
  WBTC = "wrapped-bitcoin",
  // Testing
  MTK = "mtk",
}

export enum AssetPath {
  USDC = "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040",
  USDT = "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
  DAI = "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=040",
  LINK = "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=040",
  PEPE = "https://cryptologos.cc/logos/pepe-pepe-logo.png?v=040",
  SHIB = "https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=040",
  BNB = "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=040",
  UNI = "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=040",
  ARB = "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=040",
  WBTC = "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/wrapped-bitcoin-wbtc-icon.svg",
  // Test icon.
  MTK = "",
}

export type Erc20TokenDefinition = {
  tokenId: Erc20TokenId;
  coingeckoId: CoingekoId;
  isTestToken?: boolean;
  name: string;
  address: Address;
  decimals: number;
  iconAssetPath: AssetPath;
};
