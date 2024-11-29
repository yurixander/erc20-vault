import Input from "./Input";
import { FC, useCallback, useState } from "react";
import TokenSelect from "./TokenSelect";
import { TokenSelectProps } from "./TokenSelect";

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
  maxAmount,
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
    [onAmountChange]
  );

  return (
    <Input
      error={error}
      placeholder={placeholder}
      rightElement={
        <TokenSelect
          isChainTest={isChainTest}
          tokenId={tokenId}
          setTokenId={setTokenId}
        />
      }
      legend={legend}
      legendLearnMoreHref={legendLearnMoreHref}
      value={internalValue ?? amount ?? ""}
      setValue={handleValueChange}
    />
  );
};

export default AmountInput;
