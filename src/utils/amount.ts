import BN from "bn.js";
import Decimal from "decimal.js";

export function convertAmountToBN(amount: string, decimal: number): BN {
  const [wholePart, decimalPart = "0"] = amount.split(".");

  const weiPerEth = new BN(10).pow(new BN(decimal));

  const wholeInWei = new BN(wholePart).mul(weiPerEth);
  const decimalInWei = new BN(decimalPart.padEnd(18, "0"));

  const totalInWei = wholeInWei.add(decimalInWei);

  return totalInWei;
}

export function convertBNToAmount(bn: BN, decimal: number) {
  const decimalAmount = new Decimal(bn.toString());

  return decimalAmount.div(10 ** decimal).toFixed(2)
}
