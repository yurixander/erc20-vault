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

export function convertBNToAmount(bn: BN, decimal: number): string {
  const decimalAmount = new Decimal(bn.toString());

  return decimalAmount.div(10 ** decimal).toFixed(2);
}

export function calculateEstimateInUsd(
  amount: Decimal,
  priceForOne: number,
): string {
  const estimate = amount.mul(priceForOne).toString();

  return `$${estimate} USD`;
}

export function convertUsdToBn(usd: string | number): BN {
  return new BN(new Decimal(usd).mul(100).toFixed(0));
}

export function convertBnToUsd(amount: bigint | BN): number {
  const result = new Decimal(amount.toString()).div(100);

  return result.toNumber();
}

export function calculateProfitInUsd(
  tokenInitialPrice: BN,
  currentPrice: number,
): number {
  if (currentPrice === 0) {
    return 0;
  }

  const initialPriceInUsd = convertBnToUsd(tokenInitialPrice);
  const difference = currentPrice - initialPriceInUsd;

  console.log(difference);

  return (difference / initialPriceInUsd) * 100;
}
