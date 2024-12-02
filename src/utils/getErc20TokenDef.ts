import { ARB_ERC20_TOKEN, BNB_ERC20_TOKEN, DAI_ERC20_TOKEN, LINK_ERC20_TOKEN, MY_TOKEN_SEPOLIA, PEPE_ERC20_TOKEN, SHIB_ERC20_TOKEN, UNI_ERC20_TOKEN, USDC_ERC20_TOKEN, USDT_ERC20_TOKEN, WBTC_ERC20_TOKEN } from "../config/constants";
import { Erc20TokenDefinition, Erc20TokenId } from "../config/types";

const getErc20TokenDef = (id: Erc20TokenId): Erc20TokenDefinition => {
  switch (id) {
    case Erc20TokenId.MTK:
      return MY_TOKEN_SEPOLIA;

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
};

export default getErc20TokenDef;
