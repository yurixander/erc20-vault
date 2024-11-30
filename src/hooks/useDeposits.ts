import { useCallback } from "react";
import { VAULT_CONTRACT_ADDRESS } from "../config/constants";
import { useAccount } from "wagmi";
import VAULT_ABI from "../abi/vaultAbi";
import useContractReadOnce from "./useContractRead";
import { Deposit } from "../config/types";
import BN from "bn.js";
import assert from "assert";

const useDeposits = (): (() => Promise<Error | Deposit[]>) | null => {
  const { address } = useAccount();
  const readOnce = useContractReadOnce(VAULT_ABI);

  const fetch = useCallback(async () => {
    assert(address !== undefined);

    const rawDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDeposits",
      args: [address],
    });

    // Propagate errors.
    if (rawDeposits instanceof Error) {
      return rawDeposits;
    }

    return rawDeposits.map(
      (rawDeposit): Deposit => ({
        amount: new BN(rawDeposit.amount.toString()),
        index: rawDeposit.depositId,
        startTimestamp: Number(rawDeposit.startTimestamp),
        unlockTimestamp: Number(rawDeposit.unlockTimestamp),
      })
    );
  }, [address, readOnce]);

  // Only provide the fetch function if an account is connected.
  return address === undefined ? null : fetch;
};

export default useDeposits;
