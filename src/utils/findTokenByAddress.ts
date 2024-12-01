import {Erc20TokenDefinition, Erc20TokenId} from "@/config/types";
import getErc20TokenDef from "./getErc20TokenDef";

export const availableTokensMap = new Map<string, Erc20TokenDefinition>(Object.values(Erc20TokenId).map((tokenId) => {
  const token = getErc20TokenDef(tokenId);

  return [token.mainnetAddress, token]
}))

export function getTokenByAddress(address: string): Erc20TokenDefinition {
  const token = availableTokensMap.get(address)

  if (token === undefined) {
    throw new Error(`No token found for address ${address}`)
  }

  return token;
}
