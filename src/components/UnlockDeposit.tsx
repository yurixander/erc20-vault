import VAULT_ABI from "@/abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import useToast from "@hooks/useToast";
import { FC, useCallback, useState } from "react";
import { useWatchContractEvent, useWriteContract } from "wagmi";
import Button from "./Button";
import { decodeEventLog } from "viem";

type UnlockDepositProps = {
  tokenAddress: `0x${string}`;
  depositId: bigint;
  disabled: boolean;
  className?: string;
};

const UnlockDeposit: FC<UnlockDepositProps> = ({
  depositId,
  tokenAddress,
  disabled,
  className,
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { writeContract, isPending } = useWriteContract();
  const { toast } = useToast();

  const unlockDeposit = useCallback(() => {
    writeContract(
      {
        abi: VAULT_ABI,
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "withdraw",
        args: [tokenAddress, depositId],
      },
      {
        onError: (error) => {
          console.log({
            ...error,
          });

          toast({
            title: "Please try again later.",
            description:
              "An error occurred while trying to unlock the deposit.",
            variant: "destructive",
          });
        },
        onSuccess: () => {
          setIsUnlocking(true);

          toast({
            title: "Transaction in block.",
            description: "Your deposit has been unlocked.",
          });
        },
      },
    );
  }, [depositId, toast, tokenAddress, writeContract]);

  useWatchContractEvent({
    abi: VAULT_ABI,
    address: VAULT_CONTRACT_ADDRESS,
    eventName: "WithdrawalMade",
    syncConnectedChain: true,
    onError(error) {
      console.error(error);

      setIsUnlocking(false);
    },
    onLogs: (logs) => {
      for (const log of logs) {
        const { args } = decodeEventLog({
          abi: VAULT_ABI,
          eventName: "WithdrawalMade",
          data: log.data,
          topics: log.topics,
        });

        // Check among all the tx which one was made by the user.
        if (args.depositId !== depositId) {
          continue;
        }

        setIsUnlocking(false);
      }
    },
  });

  return (
    <Button
      size="sm"
      disabled={disabled}
      isLoading={isPending || isUnlocking}
      onClick={unlockDeposit}
      className={className}
    >
      Unlock
    </Button>
  );
};

export default UnlockDeposit;
