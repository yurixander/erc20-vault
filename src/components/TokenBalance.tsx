import { Erc20TokenId } from "@/config/types";
import { FC, useEffect, useRef, useState } from "react";
import { Text } from "./Typography";
import useContractReadOnce from "@/hooks/useContractRead";
import IERC20_ABI from "@/abi/ierc20Abi";
import { useAccount } from "wagmi";
import useToast from "@/hooks/useToast";
import getErc20TokenDef from "@/utils/getErc20TokenDef";
import { convertBNToAmount } from "@/utils/amount";
import BN from "bn.js";

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

    const { decimals, mainnetAddress } = getErc20TokenDef(tokenId);

    setBalanceLoading(true);

    readOnce({
      address: mainnetAddress,
      functionName: "balanceOf",
      args: [address],
    })
      .finally(() => setBalanceLoading(false))
      .then((balance) => {
        if (tokenIdRef.current !== tokenId) {
          return;
        } else if (balance instanceof Error) {
          toast({
            title: "Balance Error",
            description: "Failed to get balance for selected token.",
            variant: "destructive",
          });

          return;
        }

        const amount = convertBNToAmount(new BN(balance.toString()), decimals);
        setTokenBalance(amount);
      });
  }, [tokenId, address, readOnce, toast]);

  if (tokenId === null) {
    return <></>;
  }

  return (
    <div className="ml-auto h-5 space-x-1">
      {isBalanceLoading ? (
        <div className="mt-1 mr-0.5 size-4 animate-spin rounded-full border-[3px] border-gray-100 border-t-black dark:border-gray-600 dark:border-t-white" />
      ) : (
        <>
          <Text
            align="right"
            size="2"
            className="inline-flex w-max text-black/70"
          >
            ≈ {tokenBalance}
          </Text>

          <Text align="right" size="1" className="w-max text-black/70">
            {tokenId}
          </Text>
        </>
      )}
    </div>
  );
};

export default TokenBalance;
