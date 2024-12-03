import VAULT_ABI from "@/abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import useToast from "@/hooks/useToast";
import { FC, useCallback } from "react";
import { useWriteContract } from "wagmi";
import Button from "./Button";

type UnlockDepositProps = {
  tokenAddress: `0x${string}`;
  depositId: number;
  disabled: boolean;
  className?: string;
};

const UnlockDeposit: FC<UnlockDepositProps> = ({
  depositId,
  tokenAddress,
  disabled,
  className,
}) => {
  const { writeContract, isPending } = useWriteContract();
  const { toast } = useToast();

  const unlockDeposit = useCallback(() => {
    writeContract(
      {
        abi: VAULT_ABI,
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "withdraw",
        args: [tokenAddress, BigInt(depositId)],
      },
      {
        onError: (error) => {
          console.log({
            ...error,
          });

          console.log(depositId);

          toast({
            title: "Please try again later.",
            description:
              "An error occurred while trying to unlock the deposit.",
            variant: "destructive",
          });
        },
        onSuccess: () => {
          toast({
            title: "The withdrawal has been processed.",
            description: "Your deposit has been unlocked.",
          });
        },
      },
    );
  }, [depositId, toast, tokenAddress, writeContract]);

  return (
    <Button
      size="sm"
      disabled={disabled}
      isLoading={isPending}
      onClick={unlockDeposit}
      className={className}
    >
      Unlock
    </Button>
  );
};

export default UnlockDeposit;
