import { Erc20TokenId } from "@/config/types";
import { FC, useEffect, useRef, useState } from "react";
import { Text } from "./Typography";
import useContractReadOnce from "@/hooks/useContractRead";
import IERC20_ABI from "@/abi/ierc20Abi";
import { useAccount } from "wagmi";
import useToast from "@/hooks/useToast";
import { convertBNToAmount } from "@/utils/amount";
import BN from "bn.js";
import SmallLoader from "./SmallLoader";
import { getErc20TokenDef, getSymbolByTokenId } from "@/utils/tokens";

type TokenBalanceProps = {
  tokenId: Erc20TokenId | null;
  className?: string;
};

const TokenBalance: FC<TokenBalanceProps> = ({ tokenId }) => {
  const tokenIdRef = useRef(tokenId);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isBalanceLoading, setBalanceLoading] = useState(false);
  const readOnce = useContractReadOnce(IERC20_ABI);
  const { address } = useAccount();
  const { toast } = useToast();

  useEffect(() => {
    tokenIdRef.current = tokenId;
  }, [tokenId]);

  useEffect(() => {
    if (tokenId === null || address === undefined) {
      return;
    }

    const { decimals, address: tokenAddress } = getErc20TokenDef(tokenId);

    setBalanceLoading(true);

    readOnce({
      address: tokenAddress,
      functionName: "balanceOf",
      args: [address],
    })
      .finally(() => setBalanceLoading(false))
      .then((balance) => {
        if (tokenIdRef.current !== tokenId) {
          return;
        } else if (balance instanceof Error) {
          toast({
            title: "Unable to Fetch Balance",
            description: balance.message,
            variant: "destructive",
          });

          return;
        }

        const amount = convertBNToAmount(new BN(balance.toString()), decimals);
        const displayAmount = addCommasToWholePart(amount);

        setTokenBalance(displayAmount);
      });
  }, [tokenId, address, readOnce, toast]);

  if (tokenId === null) {
    return <></>;
  }

  return (
    <div className="mt-0.5 ml-0.5 flex h-5 items-center">
      {isBalanceLoading ? (
        <SmallLoader />
      ) : (
        <div className="space-x-1">
          <Text
            align="right"
            size="2"
            className="inline-flex w-max text-black/70 dark:text-white/70"
          >
            Balance: {tokenBalance}
          </Text>

          <Text
            align="right"
            size="1"
            className="w-max text-black/70 dark:text-white/70"
          >
            {getSymbolByTokenId(tokenId)}
          </Text>
        </div>
      )}
    </div>
  );
};

function addCommasToWholePart(amount: string): string {
  const [wholePart, _] = amount.split(".");
  let result = "";
  let count = 0;

  for (let i = wholePart.length - 1; i >= 0; i--) {
    result = wholePart[i] + result;
    count++;

    // Add a comma every 3 digits.
    // The first digit will not have a comma.
    if (count % 3 === 0 && i !== 0) {
      result = "," + result;
    }
  }

  return result;
}

export default TokenBalance;
