import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { AssetPath, Erc20TokenDefinition, Erc20TokenId } from "./types";

export const VAULT_CONTRACT_ADDRESS =
  "0xa2B58F56a293672E631bDF32dc8287A8D52c385A";

export const VIEM_PUBLIC_CLIENT = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const USDT_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.USDT,
  name: "Tether USD",
  mainnetAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  // TODO: This token may not be deployed to Sepolia. Will likely need to deploy own dummy token contract on Sepolia for testing.
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 6,
  iconAssetPath: AssetPath.USDT,
};

export const USDC_ERC20_TOKEN: Erc20TokenDefinition = {
  id: Erc20TokenId.USDC,
  name: "USD Coin",
  mainnetAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48",
  // TODO: This token may not be deployed to Sepolia. Will likely need to deploy own dummy token contract on Sepolia for testing.
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 6,
  iconAssetPath: AssetPath.USDC,
};

export const DAI_ERC20_TOKEN: Erc20TokenDefinition =  {
  id: Erc20TokenId.DAI,
  name: "DAI",
  mainnetAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 18,
  iconAssetPath: AssetPath.DAI
}

export const LINK_ERC20_TOKEN: Erc20TokenDefinition =  {
  id: Erc20TokenId.LINK,
  name: "Chainlink",
  mainnetAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 18,
  iconAssetPath: AssetPath.LINK
}

export const PEPE_ERC20_TOKEN: Erc20TokenDefinition =  {
  id: Erc20TokenId.PEPE,
  name: "Pepe",
  mainnetAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 18,
  iconAssetPath: AssetPath.PEPE
}

export const SHIB_ERC20_TOKEN: Erc20TokenDefinition =  {
  id: Erc20TokenId.SHIB,
  name: "SHIBA INU",
  mainnetAddress: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  sepoliaAddress: "0xeb8a559c7f317c24f08405b40e6b1f3c83cdc76c",
  decimals: 18,
  iconAssetPath: AssetPath.SHIB
}
