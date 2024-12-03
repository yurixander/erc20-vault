import { useCallback, useEffect, useState } from "react";
import { VAULT_CONTRACT_ADDRESS } from "../config/constants";
import { useAccount } from "wagmi";
import VAULT_ABI from "../abi/vaultAbi";
import useContractReadOnce from "./useContractRead";
import { Deposit } from "../config/types";
import BN from "bn.js";

const useDeposits = () => {
  const { address , isConnected} = useAccount();
  const readOnce = useContractReadOnce(VAULT_ABI);
  const [deposits, setDeposits] = useState<Deposit[] | null | Error>(null)

  const fetchDeposits = useCallback(async () => {
    if (!isConnected || address === undefined) {
      return
    }

    const rawDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDeposits",
      args: [address],
    });

    if (rawDeposits instanceof Error) {
      return
    }

    const availableDeposits: Deposit[] = []

    for (const rawDeposit of rawDeposits) {
      if (rawDeposit.amount === BigInt("0")) {
        continue
      }

      availableDeposits.push({
        amount: new BN(rawDeposit.amount.toString()),
        depositId: rawDeposit.depositId,
        tokenAddress: rawDeposit.tokenAddress,
        startTimestamp: Number(rawDeposit.startTimestamp),
        unlockTimestamp: Number(rawDeposit.unlockTimestamp),
      })
    }

    setDeposits(availableDeposits)
  }, [readOnce, address, isConnected])

  useEffect(() => {
    fetchDeposits()
  }, [fetchDeposits])



  // Only provide the fetch function if an account is connected.
  return {
    deposits,
    fetchDeposits,
  }
};

export default useDeposits;
