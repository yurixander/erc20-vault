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

type ApprovalStepProps = {
  className?: string;
  onNextStep: (data: ApprovalData) => void;
};

const IS_TESTNET_CHAIN = true;

const ApprovalStep: FC<ApprovalStepProps> = ({ onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<Erc20TokenId | null>(null);
  const { toast } = useToast();

  const approveAmount = useCallback(() => {
    if (isLoading) {
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

    const { decimals } = getErc20TokenDef(tokenId);

    const amountInCents = convertAmountToBN(amount, decimals);

    onNextStep({ amount: amountInCents, token: tokenId });
  }, [toast, tokenId, amount, isLoading, onNextStep]);

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
          isLoading={isLoading}
          onClick={approveAmount}
        >
          Approve Amount
        </Button>
      </DialogFooter>
    </>
  );
};

export default ApprovalStep;
