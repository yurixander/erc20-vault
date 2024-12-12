import BN from "bn.js";
import { Address } from "viem";

export type Deposit = {
  depositId: bigint;
  tokenAddress: `0x${string}`;
  amount: BN;
  startTimestamp: number;
  unlockTimestamp: number;
};

export type ERC20TokenPrices = Record<Erc20TokenId, number | null>;

export enum Erc20TokenId {
  USDC = "USDC",
  USDT = "USDT",
  DAI = "DAI",
  LINK = "LINK",
  PEPE = "PEPE",
  SHIB = "SHIB",
  BNB = "BNB",
  UNI = "UNI",
  ARB = "ARB",
  WBTC = "WBTC",
  // Testing
  MTK = "MTK",
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
  USDC = "icons/usdc.svg",
  USDT = "icons/usdt.svg",
  DAI = "icons/dai.svg",
  LINK = "icons/link.svg",
  PEPE = "icons/pepe.webp",
  SHIB = "icons/shib.svg",
  BNB = "icons/bnb.svg",
  UNI = "icons/uni.svg",
  ARB = "icons/arb.svg",
  WBTC = "icons/wbtc.svg",
  // Test icon.
  MTK = "icons/usdc.svg",
}

export type Erc20TokenDefinition = {
  id: Erc20TokenId;
  coingeckoId: CoingekoId;
  name: string;
  mainnetAddress: Address;
  decimals: number;
  iconAssetPath: AssetPath;
};
