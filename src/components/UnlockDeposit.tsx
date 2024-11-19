"use client";

import { FC, useState } from "react";
import Button from "./Button";
import { delay } from "@/lib/utils";

type UnlockDepositProps = {
  depositIndex: number;
  disabled: boolean;
};

const UnlockDeposit: FC<UnlockDepositProps> = ({ depositIndex, disabled }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const unlockDeposit = async () => {
    if (isUnlocking) {
      return;
    }

    setIsUnlocking(true);

    // TODO: Handle unlock deposit functionality.
    await delay(5000);

    setIsUnlocking(false);
  };

  return (
    <Button
      size="sm"
      disabled={disabled}
      isLoading={isUnlocking}
      onClick={unlockDeposit}
    >
      Unlock
    </Button>
  );
};

export default UnlockDeposit;
