"use client";

import { FC, useCallback, useEffect, useState } from "react";
import useDeposits from "../hooks/useDeposits";
import { Deposit } from "../config/types";
import DepositsTable from "./DepositsTable";

const Deposits: FC = () => {
  const [deposits, setDeposits] = useState<Deposit[] | null | Error>(null);
  const fetchDeposits = useDeposits();

  const refresh = useCallback(async () => {
    if (fetchDeposits === null) {
      return;
    }

    setDeposits(null);
    setDeposits(await fetchDeposits());
  }, [fetchDeposits]);

  // Fetch deposits when on mount, or once the fetch function
  // is ready.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      {!(deposits instanceof Error) && deposits !== null && (
        <DepositsTable deposits={deposits} />
      )}
    </div>
  );
};

export default Deposits;
