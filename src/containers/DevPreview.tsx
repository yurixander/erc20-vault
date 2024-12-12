import AmountInput from "@/components/AmountInput";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import LegendWrapper from "@/components/LegendWrapper";
import { Text } from "@/components/Typography";
import { Erc20TokenId } from "@/config/types";
import useToast from "@/hooks/useToast";
import { convertAmountToBN } from "@/utils/amount";
import getErc20TokenDef from "@/utils/getErc20TokenDef";
import BN from "bn.js";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";

const DevPreview: FC = () => {
  const [approval, setApproval] = useState<ApprovalData | null>(null);

  useEffect(() => {
    document.querySelector("html")?.classList.add("dark");
  }, []);

  return (
    <>
      <div className="m-8 flex flex-col gap-4">
        <Dialog>
          <DialogTrigger>
            <Button>Create a new deposit</Button>
          </DialogTrigger>

          <DialogContent className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="h-52 w-full"
                animate={{ height: approval === null ? "13rem" : "20rem" }}
              >
                <motion.div
                  className="flex size-full flex-col"
                  key={approval?.token}
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    bounce: 0,
                    duration: 0.1,
                  }}
                >
                  {approval === null ? (
                    <ApprovalStep onNextStep={setApproval} />
                  ) : (
                    <DepositStep
                      {...approval}
                      onDeposit={() => setApproval(null)}
                      onBack={() => setApproval(null)}
                    />
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

type ApprovalData = {
  amount: BN;
  token: Erc20TokenId;
};

type ApprovalStepProps = {
  className?: string;
  onNextStep: (step: ApprovalData) => void;
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

const DepositStep: FC<
  ApprovalData & {
    className?: string;
    onDeposit: () => void;
    onBack: () => void;
  }
> = ({ onBack }) => {
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);

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

            <Text>1000 MTK</Text>
          </div>

          <div className="flex gap-1">
            <Text weight="medium">Deposit Price: </Text>

            <Text>0 USD</Text>
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
        <Button variant="outline" onClick={onBack}>
          Back to Approval
        </Button>

        <Button>Deposit & lock tokens</Button>
      </DialogFooter>
    </>
  );
};

export default DevPreview;
