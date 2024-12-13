import { FC, useCallback, useEffect, useState } from "react";
import { ApprovalData } from "@/components/DepositModal/DepositModal";
import useToast from "@/hooks/useToast";
import { Erc20TokenId } from "@/config/types";
import { getErc20TokenDef } from "@/utils/tokens";
import { convertAmountToBN } from "@/utils/amount";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog/index";
import Button from "@components/Button";
import AmountInput from "@components/AmountInput";
import useTokenApproval from "@/hooks/useTokenApproval";
import { wagmiConfig } from "@/containers/Providers";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import { WriteContractErrorType } from "wagmi/actions";
import { ContractFunctionExecutionError } from "viem";

type ApprovalStepProps = {
  className?: string;
  onNextStep: (data: ApprovalData) => void;
};

const IS_TESTNET_CHAIN = true;

const ApprovalStep: FC<ApprovalStepProps> = ({ onNextStep }) => {
  const [amount, setAmount] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<Erc20TokenId | null>(null);
  const [approvalData, setApprovalData] = useState<ApprovalData | null>(null);
  const { toast } = useToast();

  const { approve, isApproved, isPending } = useTokenApproval(wagmiConfig);

  const approveAmount = useCallback(() => {
    if (isPending) {
      return;
    }

    if (tokenId === null || amount === null) {
      toast({
        title: "Data error",
        description: "Token ID or amount is missing.",
        variant: "destructive",
      });

      return;
    }

    const { decimals, address } = getErc20TokenDef(tokenId);
    const amountInCents = convertAmountToBN(amount, decimals);

    approve({
      amount: BigInt(amountInCents.toString()),
      spender: VAULT_CONTRACT_ADDRESS,
      tokenAddress: address,
      onSuccess: () =>
        setApprovalData({ amount: amountInCents, token: tokenId }),
      onError: (err) => {
        setApprovalData(null);

        if (err instanceof Error) {
          toast({
            title: "Failed to Approve Spend",
            description: err.message,
            variant: "destructive",
          });

          return;
        }

        const { description, title } = handleApprovalErrors(err);

        toast({
          title,
          description,
          variant: "destructive",
        });
      },
    });
  }, [toast, tokenId, amount, approve, isPending]);

  useEffect(() => {
    if (!isApproved) {
      return;
    }

    if (approvalData === null) {
      toast({
        title: "Approval data error",
        description: "Approval data has expired or is not valid",
        variant: "destructive",
      });

      return;
    }

    onNextStep(approvalData);
  }, [isApproved, onNextStep, approvalData, toast]);

  return (
    <>
      <DialogHeader className="pb-4">
        <DialogTitle>Approval Step</DialogTitle>

        <DialogDescription>
          You need to first approve the amount you are going to deposit.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6">
        <AmountInput
          amount={amount}
          isChainTest={IS_TESTNET_CHAIN}
          tokenId={tokenId}
          setTokenId={setTokenId}
          onAmountChange={setAmount}
          placeholder="Amount to lock up"
          legend={
            tokenId !== null
              ? undefined
              : "You won't be able to access these funds while they're locked up."
          }
        />
      </div>

      <DialogFooter className="mt-auto">
        <Button
          disabled={tokenId === null || amount === null}
          isLoading={isPending}
          onClick={approveAmount}
        >
          Approve Amount
        </Button>
      </DialogFooter>
    </>
  );
};

function handleApprovalErrors(error: WriteContractErrorType): {
  title: string;
  description: string;
} {
  console.error(error);

  if (
    error instanceof ContractFunctionExecutionError &&
    error.cause.shortMessage === "User rejected the request."
  ) {
    return {
      title: "Approve Error",
      description: "User rejected the request, please try again.",
    };
  }

  return {
    title: "Unexpected error",
    description: "Approve failed, please try again.",
  };
}

export default ApprovalStep;
