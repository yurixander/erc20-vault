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
import BN from "bn.js";
import { Erc20TokenId } from "../config/types";
import DatePicker from "../components/DatePicker";
import LegendWrapper from "../components/LegendWrapper";
import VAULT_ABI from "../abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "../config/constants";
import getErc20TokenDef from "../utils/getErc20TokenDef";
import useToast from "@/hooks/useToast";

const DepositButton: FC = () => {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState<BN | null>(null);
  const [tokenId, setTokenId] = useState<Erc20TokenId | null>(null);
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);
  const { writeContract, isPending } = useWriteContract();
  const { toast } = useToast();

  const isReadyToSubmitTx =
    tokenId !== null && amount !== null && unlockTimestamp !== null;

  const submitDepositTx = useCallback(() => {
    if (!isReadyToSubmitTx) {
      return;
    }

    const tokenDefinition = getErc20TokenDef(tokenId);

    // TODO: Choose address based on active network.
    const address = tokenDefinition.sepoliaAddress;

    writeContract(
      {
        abi: VAULT_ABI,
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "deposit",
        args: [
          address,
          BigInt(amount.toString()),
          BigInt(unlockTimestamp.toString()),
        ],
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
          });
        },
      }
    );
  }, [
    amount,
    isReadyToSubmitTx,
    toast,
    tokenId,
    unlockTimestamp,
    writeContract,
  ]);

  // TODO: Implement deposit logic.

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
            tokenId={tokenId}
            setTokenId={setTokenId}
            value={amount}
            setValue={setAmount}
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
          <Button
            disabled={!isReadyToSubmitTx}
            type="submit"
            onClick={submitDepositTx}
            isLoading={isPending}
            // TODO: Margin should be applied within the Button component.
            rightIcon={<FiArrowRight className="ml-2" />}
          >
            Deposit & lock tokens
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositButton;
