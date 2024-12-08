import IERC20_ABI from "@/abi/ierc20Abi";
import {
  Config,
  watchContractEvent,
  WriteContractErrorType,
} from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { useAccount, useWriteContract } from "wagmi";

type Address = `0x${string}`;

type ApprovalTxData = {
  spender: Address;
  tokenAddress: Address;
  amount: bigint;
};

type ApprovalProps = ApprovalTxData & {
  onError: (error: WriteContractErrorType | Error) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
};

const useTokenApproval = (config: Config) => {
  const [txData, setTxData] = useState<ApprovalTxData | null>(null);
  const [txCompleted, setTxCompleted] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const { writeContract, isPending } = useWriteContract();
  const { address } = useAccount();

  const approve = useCallback(
    ({
      amount,
      tokenAddress,
      spender,
      onError,
      onSettled,
      onSuccess,
    }: ApprovalProps) => {
      if (txLoading) {
        onError(new Error("There is already an approval in progress."));
      }

      setTxData({
        amount,
        tokenAddress,
        spender,
      });

      setTxLoading(true);

      writeContract(
        {
          abi: IERC20_ABI,
          address: tokenAddress,
          functionName: "approve",
          args: [spender, amount],
        },
        {
          onError: onError,
          onSettled: onSettled,
          onSuccess: onSuccess,
        },
      );
    },
    [writeContract, txLoading],
  );

  useEffect(() => {
    if (txData === null || address === undefined) {
      return;
    }

    const { tokenAddress, amount, spender } = txData;

    return watchContractEvent(config, {
      abi: IERC20_ABI,
      address: tokenAddress,
      eventName: "Approval",
      onLogs: (logs) => {
        for (const log of logs) {
          const { args } = decodeEventLog({
            abi: IERC20_ABI,
            eventName: "Approval",
            data: log.data,
            topics: log.topics,
          });

          // Check among all the tx which one was made by the user.
          if (
            args.value !== amount ||
            args.spender !== spender ||
            args.owner !== address
          ) {
            continue;
          }

          setTxCompleted(true);
          setTxData(null);
          setTxLoading(false);

          break;
        }
      },
    });
  }, [txData, config, address]);

  return {
    approve,
    isPending: isPending || txLoading,
    isApproved: txCompleted,
  };
};

export default useTokenApproval;
