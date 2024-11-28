"use client";

import { FC, useCallback, useState } from "react";
import Button from "../components/Button";
import { FiArrowRight, FiPlusCircle } from "react-icons/fi";
import { useAccount, useWriteContract } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import AmountInput from "../components/AmountInput";
import { Erc20TokenId } from "../config/types";
import DatePicker from "../components/DatePicker";
import LegendWrapper from "../components/LegendWrapper";
import VAULT_ABI from "../abi/vaultAbi";
import {
  MY_TOKEN_SEPOLIA_ADDRESS,
  SEPOLIA_CHAIN_ID,
  VAULT_CONTRACT_ADDRESS,
} from "../config/constants";
import getErc20TokenDef from "../utils/getErc20TokenDef";
import useToast from "@/hooks/useToast";
import { convertAmountToBN } from "@/utils/amount";
import IERC20_ABI from "@/abi/ierc20Abi";

const DepositButton: FC = () => {
  const { isConnected, chainId } = useAccount();
  const [amount, setAmount] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<Erc20TokenId | null>(null);
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);

  const { writeContract, isPending } = useWriteContract();

  const {
    writeContract: approveTokens,
    isPending: isApprovalPending,
    isSuccess: isApprovalSuccess,
  } = useWriteContract();

  const isReadyToSubmitTx =
    tokenId !== null && amount !== null && unlockTimestamp !== null;

  const handleApprove = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (tokenId === null || amount === null) {
        return reject(new Error("Token ID or amount is missing."));
      }

      const tokenDefinition = getErc20TokenDef(tokenId);

      // TODO: Choose address based on active network.
      const address = MY_TOKEN_SEPOLIA_ADDRESS;

      const amountInCents = convertAmountToBN(amount, 18);

      approveTokens(
        {
          abi: IERC20_ABI,
          address: address,
          functionName: "approve",
          args: [VAULT_CONTRACT_ADDRESS, BigInt(amountInCents.toString())],
        },
        {
          onError: (error) => reject(error),
          onSuccess: () => resolve(),
        }
      );
    });
  }, [amount, tokenId, approveTokens]);

  const submitDepositTx = useCallback(() => {
    if (!isReadyToSubmitTx) {
      return;
    }

    const tokenDefinition = getErc20TokenDef(tokenId);

    // TODO: Choose address based on active network.
    const address = MY_TOKEN_SEPOLIA_ADDRESS;

    const amountInCents = convertAmountToBN(amount, 18);

    writeContract(
      {
        abi: VAULT_ABI,
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "deposit",
        args: [
          address,
          BigInt(amountInCents.toString()),
          BigInt(unlockTimestamp.toString()),
        ],
      },
      {
        onError: (error) => {
          console.log({
            name: error.name,
            message: error.message,
            cause: error.cause,
          });
        },
      }
    );
  }, [amount, isReadyToSubmitTx, tokenId, unlockTimestamp, writeContract]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!isConnected}>
          <FiPlusCircle />
          <span>Create a new deposit</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new deposit</DialogTitle>

          <DialogDescription>
            You&apos;re about to create a new deposit. This will lock your funds
            for a certain period of time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <AmountInput
            isChainTest={chainId === SEPOLIA_CHAIN_ID}
            tokenId={tokenId}
            setTokenId={setTokenId}
            onAmountChange={setAmount}
            placeholder="Amount to lock up"
            legend="You won't be able to access these funds while they're locked up."
            legendLearnMoreHref="#"
          />

          <LegendWrapper
            legend="You
              will need to manually withdraw the funds after this date, as they
              won't be automatically unlocked."
            linkHref="#"
          >
            <DatePicker
              label="Select a maturity date"
              setTimestamp={setUnlockTimestamp}
            />
          </LegendWrapper>
        </div>

        <DialogFooter>
          {isApprovalSuccess ? (
            <Button
              disabled={!isReadyToSubmitTx || !isApprovalSuccess}
              type="submit"
              onClick={submitDepositTx}
              isLoading={isPending || isApprovalPending}
              // TODO: Margin should be applied within the Button component.
              rightIcon={<FiArrowRight className="ml-2" />}
            >
              Deposit & lock tokens
            </Button>
          ) : (
            <ApproveButton
              disabled={!isReadyToSubmitTx}
              approvalIsPending={isApprovalPending}
              onApproveTx={handleApprove}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ApproveButton: FC<{
  disabled: boolean;
  onApproveTx: () => Promise<void>;
  approvalIsPending: boolean;
}> = ({ onApproveTx, approvalIsPending, disabled }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <Button
      isLoading={isLoading || approvalIsPending}
      disabled={disabled}
      onClick={() => {
        if (isLoading || approvalIsPending) {
          return;
        }

        setIsLoading(true);

        void onApproveTx()
          .finally(() => setIsLoading(false))
          .catch((error) => {
            toast({
              title: "Transaction error",
              description: error.message,
            });
          });
      }}
    >
      Approve
    </Button>
  );
};

export default DepositButton;
