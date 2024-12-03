import IERC20_ABI from "@/abi/ierc20Abi";
import { ToastAction } from "@/components/Toast";
import useContractReadOnce from "@/hooks/useContractRead";
import useToast from "@/hooks/useToast";
import { convertAmountToBN, convertBNToAmount } from "@/utils/amount";
import { BN } from "bn.js";
import { getUnixTime } from "date-fns/getUnixTime";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiPlusCircle } from "react-icons/fi";
import { ContractFunctionExecutionError } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { WriteContractErrorType } from "wagmi/actions";
import VAULT_ABI from "../abi/vaultAbi";
import AmountInput from "../components/AmountInput";
import Button from "../components/Button";
import DatePicker from "../components/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import LegendWrapper from "../components/LegendWrapper";
import { SEPOLIA_CHAIN_ID, VAULT_CONTRACT_ADDRESS } from "../config/constants";
import { Erc20TokenId } from "../config/types";
import getErc20TokenDef from "../utils/getErc20TokenDef";

const DepositButton: FC = () => {
  const { isConnected, chainId, address } = useAccount();
  const [amount, setAmount] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<Erc20TokenId | null>(null);
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);
  const [beforeApproved, setBeforeApproved] = useState(false);
  const { toast } = useToast();
  const readOnce = useContractReadOnce(IERC20_ABI);

  useEffect(() => {
    if (tokenId === null || address === undefined) {
      return;
    }

    const { decimals, mainnetAddress } = getErc20TokenDef(tokenId);

    readOnce({
      address: mainnetAddress,
      functionName: "allowance",
      args: [address, VAULT_CONTRACT_ADDRESS],
    }).then((allowance) => {
      if (allowance === BigInt("0") || allowance instanceof Error) {
        return;
      }

      const amountApproved = convertBNToAmount(
        new BN(allowance.toString()),
        decimals,
      );

      toast({
        title: "You already have an approval",
        description: `You already have ${amountApproved} ${tokenId} approved`,
        action: (
          <ToastAction
            altText="Use this amount for deposit."
            onClick={() => {
              setBeforeApproved(true);
              setAmount(amountApproved);

              setTokenId((prevTokenId) => {
                if (prevTokenId !== tokenId) {
                  return tokenId;
                }

                return prevTokenId;
              });
            }}
          >
            Use it
          </ToastAction>
        ),
      });
    });
  }, [address, readOnce, toast, tokenId]);

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          return;
        }

        setAmount(null);
        setTokenId(null);
        setUnlockTimestamp(null);
      }}
    >
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
            amount={amount}
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
            beforeApproved={beforeApproved}
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
  beforeApproved: boolean;
  amount: string | null;
  tokenId: Erc20TokenId | null;
  unlockTimestamp: number | null;
};

const ExecuteTxButton: FC<ExecuteTxButton> = ({
  amount,
  tokenId,
  unlockTimestamp,
  beforeApproved,
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
      toast({
        title: "Data error",
        description: "Token ID or amount is missing.",
        variant: "destructive",
      });

      return;
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
        onError: (error) => {
          const { description, title } = handleApprovalErrors(error);

          toast({
            title,
            description,
            variant: "destructive",
          });
        },
      },
    );
  }, [tokenId, amount, approveAmount, toast]);

  const submitDepositTx = useCallback(() => {
    if (unlockTimestamp === null || tokenId === null || amount === null) {
      toast({
        title: "Data Error",
        description: "Check that all fields are filled in.",
        variant: "destructive",
      });

      return;
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
          BigInt(getUnixTime(unlockTimestamp)),
        ],
      },
      {
        onError: (error) => {
          const { description, title } = handleDepositErrors(error);

          toast({
            title,
            description,
            variant: "destructive",
          });
        },
        onSuccess() {
          toast({
            title: "Deposit Success",
            description: "",
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
  }, [amount, toast, tokenId, unlockTimestamp, writeContract]);

  const isButtonLoading = useMemo(
    () => (!isApprovalSuccess && isApprovalPending) || isPending,
    [isApprovalPending, isApprovalSuccess, isPending],
  );

  const isDepositAvailable = useMemo(
    () => beforeApproved || isApprovalSuccess,
    [beforeApproved, isApprovalSuccess],
  );

  return (
    <Button
      isLoading={isButtonLoading}
      disabled={!isReadyToSubmitTx}
      type="submit"
      rightIcon={<FiArrowRight />}
      onClick={() => {
        if (isButtonLoading) {
          return;
        }

        if (!isDepositAvailable) {
          handleApprove();

          return;
        }

        submitDepositTx();
      }}
    >
      {isDepositAvailable ? "Deposit & lock tokens" : "Approve"}
    </Button>
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

export default DepositButton;
