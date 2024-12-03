import BN from "bn.js";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import VAULT_ABI from "../abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "../config/constants";
import { Deposit } from "../config/types";
import useContractReadOnce from "./useContractRead";

export class AccountNotFoundError extends Error {
  message = "Please check your connection and try again.";
}

export class FetchDepositsError extends Error {
  message = "Failed to fetch deposits. Please try again.";
}

const useDeposits = () => {
  const { address, isConnected } = useAccount();
  const readOnce = useContractReadOnce(VAULT_ABI);

  const fetchDeposits = useCallback(async () => {
    if (address === undefined) {
      throw new AccountNotFoundError();
    }

    const rawDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDeposits",
      args: [address],
    });

    if (rawDeposits instanceof Error) {
      throw new FetchDepositsError();
    }

    const availableDeposits: Deposit[] = [];

    for (const rawDeposit of rawDeposits) {
      if (rawDeposit.amount === BigInt("0")) {
        continue;
      }

      availableDeposits.push({
        amount: new BN(rawDeposit.amount.toString()),
        depositId: rawDeposit.depositId,
        tokenAddress: rawDeposit.tokenAddress,
        startTimestamp: Number(rawDeposit.startTimestamp),
        unlockTimestamp: Number(rawDeposit.unlockTimestamp),
      });
    }

    return availableDeposits;
  }, [readOnce, address]);

  // Only provide the fetch function if an account is connected.
  return isConnected ? fetchDeposits : null;
};

export default useDeposits;
