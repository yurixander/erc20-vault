"use client";

import { FC, useCallback, useMemo, useState } from "react";
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
          <ExecuteTxButton
            amount={amount}
            tokenId={tokenId}
            unlockTimestamp={unlockTimestamp}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type ExecuteTxButton = {
  amount: string | null;
  tokenId: Erc20TokenId | null;
  unlockTimestamp: number | null;
};

const ExecuteTxButton: FC<ExecuteTxButton> = ({
  amount,
  tokenId,
  unlockTimestamp,
}) => {
  const { writeContract, isPending } = useWriteContract();
  const { toast } = useToast();

  const {
    writeContract: approveAmount,
    isSuccess: isApprovalSuccess,
    isPending: isApprovalPending,
  } = useWriteContract();

  const isReadyToSubmitTx =
    tokenId !== null && amount !== null && unlockTimestamp !== null;

  const handleApprove = useCallback(() => {
    if (tokenId === null || amount === null) {
      return new Error("Token ID or amount is missing.");
    }

    const { decimals, mainnetAddress } = getErc20TokenDef(tokenId);

    const amountInCents = convertAmountToBN(amount, decimals);

    approveAmount(
      {
        abi: IERC20_ABI,
        address: mainnetAddress,
        functionName: "approve",
        args: [VAULT_CONTRACT_ADDRESS, BigInt(amountInCents.toString())],
      },
      {
        onError: (error) => {},
      }
    );
  }, [amount, tokenId, approveAmount]);

  const submitDepositTx = useCallback(() => {
    if (unlockTimestamp === null || tokenId === null || amount === null) {
      throw new Error("Check that all fields are filled in.");
    }

    const { decimals, mainnetAddress } = getErc20TokenDef(tokenId);

    const amountInCents = convertAmountToBN(amount, decimals);

    writeContract(
      {
        abi: VAULT_ABI,
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "deposit",
        args: [
          mainnetAddress,
          BigInt(amountInCents.toString()),
          BigInt(unlockTimestamp),
        ],
      },
      {
        onError: (error) => {},
        onSuccess(data, variables, context) {},
        onSettled(data, error, variables, context) {
          // Esta siendo procesado (Ya la transaccion no sera revertida.)
        },
      }
    );
  }, [amount, tokenId, unlockTimestamp, writeContract]);

  const isButtonLoading = useMemo(
    () => (!isApprovalSuccess && isApprovalPending) || isPending,
    [isApprovalPending, isApprovalSuccess, isPending]
  );

  return (
    <Button
      isLoading={isButtonLoading}
      disabled={!isReadyToSubmitTx}
      type="submit"
      // TODO: Margin should be applied within the Button component.
      rightIcon={<FiArrowRight className="ml-2" />}
      onClick={() => {
        if (isButtonLoading) {
          return;
        }

        if (!isApprovalSuccess) {
          handleApprove();

          return;
        }

        submitDepositTx();
      }}
    >
      {isApprovalSuccess ? "Deposit & lock tokens" : "Approve"}
    </Button>
  );
};

export default DepositButton;
