import { FC, useCallback, useEffect, useState } from "react";
import { ApprovalData } from "./DepositModal";
import useTokenPrice from "@/hooks/useTokenPrice";
import { getErc20TokenDef } from "@/utils/tokens";
import {
  calculateEstimateInUsd,
  convertBNToAmount,
  convertUsdToBn,
} from "@/utils/amount";
import Decimal from "decimal.js";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog/index";
import { Text } from "@components/Typography";
import SmallLoader from "@components/SmallLoader";
import LegendWrapper from "@components/LegendWrapper";
import DatePicker from "@components/DatePicker";
import Button from "@components/Button";
import { useWriteContract } from "wagmi";
import useToast from "@/hooks/useToast";
import VAULT_ABI from "@/abi/vaultAbi";
import { MAINNET_TOKENS, VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import { getUnixTime } from "date-fns/getUnixTime";
import { WriteContractErrorType } from "wagmi/actions";
import { ContractFunctionExecutionError } from "viem";

type DepositDetail = {
  displayAmount: string;
  displayPrice: string;
};

interface DepositStepProps extends ApprovalData {
  className?: string;
  onDepositAccepted: () => void;
  onBack: () => void;
}

const DepositStep: FC<DepositStepProps> = ({
  onBack,
  amount,
  token,
  onDepositAccepted,
}) => {
  const { getPriceByTokenId } = useTokenPrice(MAINNET_TOKENS);
  const { writeContract, isPending } = useWriteContract();
  const { toast } = useToast();
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);
  const [detail, setDetail] = useState<DepositDetail | null>(null);

  const generateDepositDetail = useCallback(async () => {
    const { isTestToken, decimals } = getErc20TokenDef(token);
    const displayAmount = convertBNToAmount(amount, decimals);
    const priceOfToken = isTestToken ? 0 : await getPriceByTokenId?.(token);

    const price =
      priceOfToken === undefined
        ? "Price unavailable."
        : calculateEstimateInUsd(new Decimal(displayAmount), priceOfToken);

    setDetail({
      displayAmount: displayAmount,
      displayPrice: price,
    });
  }, [token, amount, getPriceByTokenId]);

  useEffect(() => {
    if (detail !== null) {
      return;
    }

    generateDepositDetail();
  }, [generateDepositDetail, detail]);

  const submitDepositTx = useCallback(async () => {
    if (unlockTimestamp === null) {
      toast({
        title: "Unlock Date Failed",
        description: "Please set a valid unlock date",
        variant: "destructive",
      });

      return;
    }

    if (getPriceByTokenId === null) {
      toast({
        title: "Prices Unavailable",
        description: "Please try again later.",
        variant: "destructive",
      });

      return;
    }

    const { address, isTestToken } = getErc20TokenDef(token);

    try {
      const price = isTestToken === true ? 0 : await getPriceByTokenId(token);
      const priceInBn = convertUsdToBn(price);

      writeContract(
        {
          abi: VAULT_ABI,
          address: VAULT_CONTRACT_ADDRESS,
          functionName: "deposit",
          args: [
            address,
            BigInt(priceInBn.toString()),
            BigInt(amount.toString()),
            BigInt(getUnixTime(unlockTimestamp)),
          ],
        },
        {
          onSuccess: onDepositAccepted,
          onError: (error) => {
            const { description, title } = handleDepositErrors(error);

            toast({
              title,
              description,
              variant: "destructive",
            });
          },
          onSettled(_, error) {
            if (error !== null) {
              const { title, description } = handleDepositErrors(error);

              toast({
                title: title,
                description: description,
                variant: "destructive",
              });

              return;
            }

            toast({
              title: "Transaction in block",
              description: "Transaction is processing, please wait.",
            });
          },
        },
      );
    } catch {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "Failed to get the price of the token. Please try again later.",
      });
    }
  }, [
    amount,
    token,
    toast,
    unlockTimestamp,
    writeContract,
    getPriceByTokenId,
    onDepositAccepted,
  ]);

  return (
    <>
      <DialogHeader className="pb-1">
        <DialogTitle>Create a new deposit</DialogTitle>

        <DialogDescription>
          You&apos;re about to create a new deposit. This will lock your funds
          for a certain period of time.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-5">
        <div className="flex flex-col gap-4">
          <div className="flex gap-1">
            <Text weight="medium">Deposit Amount: </Text>

            {detail === null ? (
              <SmallLoader />
            ) : (
              <Text>{detail.displayAmount}</Text>
            )}
          </div>

          <div className="flex gap-1">
            <Text weight="medium">Deposit Price: </Text>

            {detail === null ? (
              <SmallLoader />
            ) : (
              <Text>{detail.displayPrice}</Text>
            )}
          </div>
        </div>

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

      <DialogFooter className="mt-auto">
        <Button variant="outline" onClick={onBack} disabled={isPending}>
          Back to Approval
        </Button>

        <Button
          disabled={unlockTimestamp === null}
          isLoading={isPending}
          onClick={submitDepositTx}
        >
          Deposit & lock tokens
        </Button>
      </DialogFooter>
    </>
  );
};

const GAS_ERROR_SHORT_MESSAGE = `The contract function \"deposit"\ reverted with the following reason:\nArithmetic operation resulted in underflow or overflow.`;

function handleDepositErrors(error: WriteContractErrorType): {
  title: string;
  description: string;
} {
  console.error(error);

  if (
    error instanceof ContractFunctionExecutionError &&
    error.cause.shortMessage === "User rejected the request."
  ) {
    return {
      title: "Deposit Error",
      description: "User rejected the request, please try again.",
    };
  } else if (
    error instanceof ContractFunctionExecutionError &&
    error.cause.shortMessage === GAS_ERROR_SHORT_MESSAGE
  ) {
    return {
      title: "Deposit Error",
      description: "The gas fee is too large, please try again later.",
    };
  }

  return {
    title: "Unexpected error",
    description: "Deposit failed, please try again.",
  };
}

export default DepositStep;
