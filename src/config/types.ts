import BN from "bn.js";
import { Address } from "viem";

export type Erc20Token = {
  name: string;
  iconSrc: string;
}

export type Deposit = {
  index: number;
  amount: BN;
  startTimestamp: number;
  unlockTimestamp: number;
};

export enum Erc20TokenId {
  USDC = "USDC",
  USDT = "USDT",
}

// TODO: Add some icons.
export enum AssetPath {}

export type Erc20TokenDefinition = {
  id: Erc20TokenId;
  name: string;
  mainnetAddress: Address;
  sepoliaAddress: Address;
  decimals: number;
  iconAssetPath: AssetPath;
};
