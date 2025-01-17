import {
  AssetPath,
  CoingekoId,
  Erc20TokenDefinition,
  Erc20TokenId,
} from "./types";
import { createPublicClient, webSocket } from "viem";
import { sepolia } from "viem/chains";

export enum LocalStorageKeys {
  CachedPrices = "cached_prices_storage_key",
}

export enum AppRoute {
  App = "/",
  Dev = "/dev",
}

export enum WebSocketsUrl {
  Sepolia = "https://rpc.ankr.com/eth_sepolia",
  Mainnet = "https://rpc.ankr.com/eth",
}

// TODO: In production change sepolia for mainnet.
export const mainnetPublicClient = createPublicClient({
  chain: sepolia,
  transport: webSocket(WebSocketsUrl.Sepolia),
});

export const VAULT_CONTRACT_ADDRESS =
  "0xb85a341671cf6DEFdaf781960ef66D03A93f6791";

export const TEST_TOKEN_SEPOLIA_ADDRESS =
  "0xcAC8935Fa8253575CAF0F63eA45A61a9E352A2ae";

export const MAINNET_TOKENS = Object.values(Erc20TokenId).filter(
  (t) => t !== Erc20TokenId.MTK,
);

// Test token.
export const TEST_TOKEN_SEPOLIA: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.MTK,
  name: "My token",
  isTestToken: true,
  address: TEST_TOKEN_SEPOLIA_ADDRESS,
  decimals: 18,
  iconAssetPath: AssetPath.MTK,
  coingeckoId: CoingekoId.MTK,
};

export const USDT_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.USDT,
  name: "Tether USD",
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  decimals: 6,
  iconAssetPath: AssetPath.USDT,
  coingeckoId: CoingekoId.USDT,
};

export const USDC_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.USDC,
  name: "USD Coin",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48",
  decimals: 6,
  iconAssetPath: AssetPath.USDC,
  coingeckoId: CoingekoId.USDC,
};

export const DAI_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.DAI,
  name: "DAI",
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  decimals: 18,
  iconAssetPath: AssetPath.DAI,
  coingeckoId: CoingekoId.DAI,
};

export const LINK_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.LINK,
  name: "Chainlink",
  address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  decimals: 18,
  iconAssetPath: AssetPath.LINK,
  coingeckoId: CoingekoId.LINK,
};

export const PEPE_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.PEPE,
  name: "Pepe",
  address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  decimals: 18,
  iconAssetPath: AssetPath.PEPE,
  coingeckoId: CoingekoId.PEPE,
};

export const SHIB_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.SHIB,
  name: "SHIBA INU",
  address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  decimals: 18,
  iconAssetPath: AssetPath.SHIB,
  coingeckoId: CoingekoId.SHIB,
};

export const BNB_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.BNB,
  name: "BNB",
  address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  decimals: 18,
  iconAssetPath: AssetPath.BNB,
  coingeckoId: CoingekoId.BNB,
};

export const UNI_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.UNI,
  name: "Uniswap",
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  decimals: 18,
  iconAssetPath: AssetPath.UNI,
  coingeckoId: CoingekoId.UNI,
};

export const ARB_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.ARB,
  name: "Arbitrum",
  address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
  decimals: 18,
  iconAssetPath: AssetPath.ARB,
  coingeckoId: CoingekoId.ARB,
};

export const WBTC_ERC20_TOKEN: Erc20TokenDefinition = {
  tokenId: Erc20TokenId.WBTC,
  name: "Wrapped BTC",
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  decimals: 8,
  iconAssetPath: AssetPath.WBTC,
  coingeckoId: CoingekoId.WBTC,
};
