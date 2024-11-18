import BN from "bn.js";
import Input, { InputProps } from "./Input";
import { FC, useCallback } from "react";
import TokenSelect from "./TokenSelect";
import { TokenSelectProps } from "./TokenSelect";

export type AmountInputProps = TokenSelectProps & {
  placeholder?: string;
  maxAmount?: BN;
  value: BN | null;
  setValue: (newValue: BN | null) => void;
  legend?: string;
  legendLearnMoreHref?: string;
};

const AmountInput: FC<AmountInputProps> = ({
  value,
  maxAmount,
  setValue,
  tokenId,
  setTokenId,
  placeholder = "Enter an amount",
  legend,
  legendLearnMoreHref,
}) => {
  // TODO: Format value as a string.
  const stringValue = value?.toString();

  const handleValueChange = useCallback(
    (newValue: string) => {
      // Only allow unsigned digits.
      if (Number(newValue) < 0) {
        return;
      }

      setValue(new BN(newValue));
    },
    [setValue]
  );

  return (
    <Input
      type="number"
      placeholder={placeholder}
      rightElement={<TokenSelect tokenId={tokenId} setTokenId={setTokenId} />}
      legend={legend}
      legendLearnMoreHref={legendLearnMoreHref}
      value={stringValue}
      setValue={handleValueChange}
    />
  );
};

export default AmountInput;
