import BN from "bn.js";
import Decimal from "decimal.js";

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
