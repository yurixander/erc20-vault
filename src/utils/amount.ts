import { Erc20TokenId } from "@/config/types";
import BN from "bn.js";
import Decimal from "decimal.js";
import getErc20TokenDef from "./getErc20TokenDef";

export function convertAmountToBN(amount: string, decimal: number): BN {
  const [wholePart, decimalPart = "0"] = amount.split(".");

  const decimalMul = new BN(10).pow(new BN(decimal));

  const wholeInCents = new BN(wholePart).mul(decimalMul);
  const decimalInCents = new BN(decimalPart.padEnd(decimal, "0"));

  const totalInCents = wholeInCents.add(decimalInCents);

  return totalInCents;
}

export function convertBNToAmount(bn: BN, decimal: number) {
  const decimalAmount = new Decimal(bn.toString());

  return decimalAmount.div(10 ** decimal).toFixed(2);
}

export async function getErc20TokenPriceInUsd(
  erc20TokenId: Erc20TokenId,
): Promise<number> {
  const { coingeckoId } = getErc20TokenDef(erc20TokenId);
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }

  const data = await response.json();
  const tokenData = data[coingeckoId];

  if (tokenData === undefined) {
    console.warn(`The token was not found in coingeko: ${coingeckoId}`);

    return 0;
  }

  const price = tokenData.usd;

  if (typeof price !== "number") {
    console.warn(`The price is not a number: ${price}`);

    return 0;
  }

  return price;
}
