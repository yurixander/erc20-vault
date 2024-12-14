import { FC, useCallback, useEffect, useState } from "react";
import Input from "./Input";
import TokenSelect from "./TokenSelect";
import { TokenSelectProps } from "./TokenSelect";
import { Text } from "./Typography";
import Decimal from "decimal.js";
import SmallLoader from "./SmallLoader";
import useDebounce from "@/hooks/useDebounce";
import useTokenPrice from "@/hooks/useTokenPrice";
import { MAINNET_TOKENS } from "@/config/constants";
import { calculateEstimateInUsd } from "@/utils/amount";
import { getErc20TokenDef } from "@/utils/tokens";

export type AmountInputProps = TokenSelectProps & {
  amount: string | null;
  onAmountChange: (newValue: string | null) => void;
  placeholder?: string;
  maxAmount?: number;
  legend?: string;
  legendLearnMoreHref?: string;
  isChainTest?: boolean;
};

const NUMBER_REGEX = new RegExp(/^([1-9]\d*|0)(\.\d+)?$/);

const AmountInput: FC<AmountInputProps> = ({
  onAmountChange,
  tokenId,
  setTokenId,
  placeholder = "Enter an amount",
  legend,
  legendLearnMoreHref,
  isChainTest,
  amount,
}) => {
  const [internalValue, setInternalValue] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [estimatePrice, setEstimatedPrice] = useState<string | null>(null);
  const [estimateLoading, setEstimatedLoading] = useState(false);
  const amountDebounce = useDebounce(amount, 700);

  const { getPriceByTokenId } = useTokenPrice(MAINNET_TOKENS);

  useEffect(() => {
    if (
      tokenId === null ||
      amountDebounce === null ||
      getPriceByTokenId === null
    ) {
      setEstimatedPrice(null);

      return;
    }

    const { isTestToken } = getErc20TokenDef(tokenId);

    if (isTestToken === true) {
      setEstimatedPrice(calculateEstimateInUsd(new Decimal(amountDebounce), 0));

      return;
    }

    setEstimatedLoading(true);

    getPriceByTokenId(tokenId)
      .finally(() => setEstimatedLoading(false))
      .then((price) => {
        const estimateInUsd = calculateEstimateInUsd(
          new Decimal(amountDebounce),
          price,
        );

        setEstimatedPrice(estimateInUsd);
      })
      .catch((error) => {
        setEstimatedPrice(null);

        console.error(error);
      });
  }, [tokenId, amountDebounce, getPriceByTokenId]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);

      // Only allow unsigned digits.
      try {
        if (NUMBER_REGEX.test(newValue) && Number(newValue) !== 0) {
          setError(null);

          onAmountChange(newValue);
        } else if (newValue.length === 0) {
          setError(null);

          onAmountChange(null);
        } else if (Number(newValue) <= 0) {
          setError("Amount should be more than zero.");

          onAmountChange(null);
        } else {
          setError("Amount should be a valid number.");

          onAmountChange(null);
        }
      } catch {
        onAmountChange(null);

        setError("Unexpected error.");
      }
    },
    [onAmountChange],
  );

  return (
    <Input
      error={error}
      placeholder={placeholder}
      rightElement={
        <>
          {estimatePrice !== null &&
            (estimateLoading ? (
              <SmallLoader />
            ) : (
              <Text
                size="1"
                className="w-max max-w-64 shrink-0 text-black/70 dark:text-white/70"
              >
                ≈ {estimatePrice}
              </Text>
            ))}

          <TokenSelect
            isChainTest={isChainTest}
            tokenId={tokenId}
            setTokenId={setTokenId}
          />
        </>
      }
      legend={legend}
      legendLearnMoreHref={legendLearnMoreHref}
      value={internalValue ?? amount ?? ""}
      setValue={handleValueChange}
    />
  );
};

export default AmountInput;
