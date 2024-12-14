import { Erc20TokenDefinition, Erc20TokenId } from "@/config/types";
import {
  ARB_ERC20_TOKEN,
  BNB_ERC20_TOKEN,
  DAI_ERC20_TOKEN,
  LINK_ERC20_TOKEN,
  TEST_TOKEN_SEPOLIA,
  PEPE_ERC20_TOKEN,
  SHIB_ERC20_TOKEN,
  UNI_ERC20_TOKEN,
  USDC_ERC20_TOKEN,
  USDT_ERC20_TOKEN,
  WBTC_ERC20_TOKEN,
} from "../config/constants";

export function getSymbolByTokenId(tokenId: Erc20TokenId): string {
  switch (tokenId) {
    case Erc20TokenId.USDC:
      return "USDC";
    case Erc20TokenId.USDT:
      return "USDT";
    case Erc20TokenId.DAI:
      return "DAI";
    case Erc20TokenId.LINK:
      return "LINK";
    case Erc20TokenId.PEPE:
      return "PEPE";
    case Erc20TokenId.SHIB:
      return "SHIB";
    case Erc20TokenId.BNB:
      return "BNB";
    case Erc20TokenId.UNI:
      return "UNI";
    case Erc20TokenId.ARB:
      return "ARB";
    case Erc20TokenId.WBTC:
      return "WBTC";
    // Testing
    case Erc20TokenId.MTK:
      return "MTK";
  }
}

export function getErc20TokenDef(tokenId: Erc20TokenId): Erc20TokenDefinition {
  switch (tokenId) {
    case Erc20TokenId.MTK:
      return TEST_TOKEN_SEPOLIA;

    case Erc20TokenId.USDT:
      return USDT_ERC20_TOKEN;

    case Erc20TokenId.USDC:
      return USDC_ERC20_TOKEN;

    case Erc20TokenId.DAI:
      return DAI_ERC20_TOKEN;

    case Erc20TokenId.LINK:
      return LINK_ERC20_TOKEN;

    case Erc20TokenId.PEPE:
      return PEPE_ERC20_TOKEN;

    case Erc20TokenId.SHIB:
      return SHIB_ERC20_TOKEN;

    case Erc20TokenId.BNB:
      return BNB_ERC20_TOKEN;

    case Erc20TokenId.UNI:
      return UNI_ERC20_TOKEN;

    case Erc20TokenId.ARB:
      return ARB_ERC20_TOKEN;

    case Erc20TokenId.WBTC:
      return WBTC_ERC20_TOKEN;
  }
}

export function getTokenByAddress(address: string): Erc20TokenDefinition {
  const tokenIds = Object.values(Erc20TokenId);

  for (const tokenId of tokenIds) {
    const tokenDef = getErc20TokenDef(tokenId);

    if (tokenDef.address === address) {
      return tokenDef;
    }
  }

  throw new Error(`No token found for address ${address}`);
}
