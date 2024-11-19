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
  BNB = "BNB"
}

export enum AssetPath {
  USDC = "usdc.svg",
  USDT = "usdt.svg",
  DAI = "dai.svg",
  LINK = "link.svg",
  PEPE = "pepe.webp",
  SHIB = "shib.svg",
  BNB = "bnb.svg",
}

export type Erc20TokenDefinition = {
  id: Erc20TokenId;
  name: string;
  mainnetAddress: Address;
  sepoliaAddress: Address;
  decimals: number;
  iconAssetPath: AssetPath;
};
