import BN from "bn.js";
import { Address } from "viem";

export type Deposit = {
  depositId: bigint;
  tokenAddress: `0x${string}`;
  amount: BN;
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
  MTK = "",
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
  // TODO: Put real test icon.
  MTK = "icons/mtk.svg",
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
