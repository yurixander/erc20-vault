import { FC, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Erc20TokenId } from "../config/types";

export type TokenSelectProps = {
  tokenId: Erc20TokenId | null;
  setTokenId: (tokenId: Erc20TokenId | null) => void;
};

function assetTokenId(tok: string): asserts tok is Erc20TokenId {
  if (!Object.values(Erc20TokenId).includes(tok as Erc20TokenId)) {
    throw new Error(`Invalid token ID: ${tok}`);
  }
}

const TokenSelect: FC<TokenSelectProps> = ({ tokenId, setTokenId }) => {
  const handleValueChange = useCallback(
    (newValue: string) => {
      assetTokenId(newValue);
      setTokenId(newValue);
    },
    [setTokenId]
  );

  return (
    <Select onValueChange={handleValueChange} value={tokenId ?? undefined}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a token" />
      </SelectTrigger>

      <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <SelectGroup>
          <SelectLabel>ERC-20 Tokens</SelectLabel>

          {Object.values(Erc20TokenId).map((tokenId) => (
            <SelectItem key={tokenId} value={tokenId}>
              {tokenId}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TokenSelect;
