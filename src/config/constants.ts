import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { AssetPath, Erc20TokenDefinition, Erc20TokenId } from "./types";

export enum AppRoute {
  App = "App",
  Dev = "Dev"
}

export const VAULT_CONTRACT_ADDRESS =
  "0xbD55b1508a7Bde76dC996cb6aFdC1Ca020d853ff";

export const MY_TOKEN_SEPOLIA_ADDRESS = "0xcAC8935Fa8253575CAF0F63eA45A61a9E352A2ae";

export const SEPOLIA_CHAIN_ID = 11155111;

export const VIEM_PUBLIC_CLIENT = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// Test token.
export const MY_TOKEN_SEPOLIA: Erc20TokenDefinition = {
  id: Erc20TokenId.MTK,
  name: "My token",
  mainnetAddress: MY_TOKEN_SEPOLIA_ADDRESS,
  decimals: 18,
  iconAssetPath: AssetPath.LINK,
}

export const USDT_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.USDT,
  name: "Tether USD",
  mainnetAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  decimals: 6,
  iconAssetPath: AssetPath.USDT,
};

export const USDC_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.USDC,
  name: "USD Coin",
  mainnetAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48",
  decimals: 6,
  iconAssetPath: AssetPath.USDC,
};

export const DAI_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.DAI,
  name: "DAI",
  mainnetAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  decimals: 18,
  iconAssetPath: AssetPath.DAI,
};

export const LINK_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.LINK,
  name: "Chainlink",
  mainnetAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  decimals: 18,
  iconAssetPath: AssetPath.LINK,
};

export const PEPE_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.PEPE,
  name: "Pepe",
  mainnetAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  decimals: 18,
  iconAssetPath: AssetPath.PEPE,
};

export const SHIB_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.SHIB,
  name: "SHIBA INU",
  mainnetAddress: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  decimals: 18,
  iconAssetPath: AssetPath.SHIB,
};

export const BNB_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.BNB,
  name: "BNB",
  mainnetAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  decimals: 18,
  iconAssetPath: AssetPath.BNB,
};

export const UNI_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.UNI,
  name: "Uniswap",
  mainnetAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  decimals: 18,
  iconAssetPath: AssetPath.UNI,
};

export const ARB_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.ARB,
  name: "Arbitrum",
  mainnetAddress: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
  decimals: 18,
  iconAssetPath: AssetPath.ARB,
};

export const WBTC_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.WBTC,
  name: "Wrapped BTC",
  mainnetAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  decimals: 8,
  iconAssetPath: AssetPath.WBTC,
};
