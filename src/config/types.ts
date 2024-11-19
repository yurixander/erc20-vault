import BN from "bn.js";
import { Address } from "viem";

export type Deposit = {
  index: number;
  amount: BN;
  startTimestamp: number;
  unlockTimestamp: number;
};

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
  WBTC = "WBTC"
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
  WBTC = "icons/wbtc.svg"
}

export type Erc20TokenDefinition = {
  id: Erc20TokenId;
  name: string;
  mainnetAddress: Address;
  sepoliaAddress: Address;
  decimals: number;
  iconAssetPath: AssetPath;
};
