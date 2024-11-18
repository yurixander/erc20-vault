"use client";

import { FC, useState } from "react";
import Button from "./Button";
import { Deposit } from "./DepositsTable";
import { delay } from "@/lib/utils";

type UnlockDepositProps = {
  deposit: Deposit;
};

const UnlockDeposit: FC<UnlockDepositProps> = ({ deposit }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const unlockDeposit = async () => {
    if (isUnlocking) {
      return;
    }

    setIsUnlocking(true);

    // TODO: Handle deposit functionality.
    await delay(5000);

    setIsUnlocking(false);
  };

  return (
    <Button
      size="sm"
      disabled={deposit.unlockPercentage !== 100}
      isLoading={isUnlocking}
      onClick={unlockDeposit}
    >
      Unlock
    </Button>
  );
};

export default UnlockDeposit;
