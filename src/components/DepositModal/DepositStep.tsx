import { FC, useCallback, useEffect, useState } from "react";
import { ApprovalData } from "./DepositModal";
import useTokenPrice from "@/hooks/useTokenPrice";
import { getErc20TokenDef } from "@/utils/tokens";
import { calculateEstimateInUsd, convertBNToAmount } from "@/utils/amount";
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

type DepositDetail = {
  displayAmount: string;
  displayPrice: string;
};

interface DepositStepProps extends ApprovalData {
  className?: string;
  onDeposit: () => void;
  onBack: () => void;
}

const DepositStep: FC<DepositStepProps> = ({ onBack, amount, token }) => {
  const { getPriceInUsd } = useTokenPrice();
  const [unlockTimestamp, setUnlockTimestamp] = useState<number | null>(null);
  const [detail, setDetail] = useState<DepositDetail | null>(null);

  const generateDepositDetail = useCallback(async () => {
    const { isTestToken, decimals } = getErc20TokenDef(token);
    const priceOfToken = isTestToken ? 0 : await getPriceInUsd(token);
    const displayAmount = convertBNToAmount(amount, decimals);

    const price = calculateEstimateInUsd(
      new Decimal(displayAmount),
      priceOfToken,
    );

    setDetail({
      displayAmount: displayAmount,
      displayPrice: price,
    });
  }, [token, amount, getPriceInUsd]);

  useEffect(() => {
    if (detail !== null) {
      return;
    }

    generateDepositDetail();
  }, [generateDepositDetail, detail]);

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
        <Button variant="outline" onClick={onBack}>
          Back to Approval
        </Button>

        <Button disabled={unlockTimestamp === null}>
          Deposit & lock tokens
        </Button>
      </DialogFooter>
    </>
  );
};

export default DepositStep;
