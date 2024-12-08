import { TEST_TOKEN_SEPOLIA } from "@/config/constants";
import React, { FC, useCallback, useMemo } from "react";
import { Erc20TokenId } from "../config/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select";

export type TokenSelectProps = {
  tokenId: Erc20TokenId | null;
  setTokenId: (tokenId: Erc20TokenId | null) => void;
  isChainTest?: boolean;
};

function assetTokenId(tok: string): asserts tok is Erc20TokenId {
  if (!Object.values(Erc20TokenId).includes(tok as Erc20TokenId)) {
    throw new Error(`Invalid token ID: ${tok}`);
  }
}

const { id: testTokenId } = TEST_TOKEN_SEPOLIA;

const TokenSelect: FC<TokenSelectProps> = ({
  tokenId,
  setTokenId,
  isChainTest,
}) => {
  const handleValueChange = useCallback(
    (newValue: string) => {
      assetTokenId(newValue);
      setTokenId(newValue);
    },
    [setTokenId]
  );

  const selectableItems: React.ReactNode = useMemo(() => {
    if (isChainTest === true) {
      return (
        <SelectItem key={testTokenId} value={testTokenId}>
          {testTokenId}
        </SelectItem>
      );
    }

    return Object.values(Erc20TokenId).map((tokenId) => {
      if (tokenId === testTokenId) {
        return;
      }

      return (
        <SelectItem key={tokenId} value={tokenId}>
          {tokenId}
        </SelectItem>
      );
    });
  }, [isChainTest]);

  return (
    <Select onValueChange={handleValueChange} value={tokenId ?? undefined}>
      <SelectTrigger className="w-32 shrink-0">
        <SelectValue placeholder="Select a token" />
      </SelectTrigger>

      <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <SelectGroup>
          <SelectLabel>ERC-20 Tokens</SelectLabel>

          {selectableItems}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TokenSelect;
