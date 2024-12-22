import BN from "bn.js";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import VAULT_ABI from "../abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "../config/constants";
import { Deposit } from "../config/types";
import useContractReadOnce from "./useContractRead";
import { ToastAction } from "../components/Toast";
import useToast from "./useToast";

const useDeposits = () => {
  const { address } = useAccount();
  const readOnce = useContractReadOnce(VAULT_ABI);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deposits, setDeposits] = useState<Deposit[] | null>(null);
  const { toast } = useToast();

  const fetchDeposits = useCallback(async () => {
    if (address === undefined) {
      const allRawDeposits = await readOnce({
        address: VAULT_CONTRACT_ADDRESS,
        functionName: "getAllDeposits",
        args: [],
      });

      if (allRawDeposits instanceof Error) {
        throw allRawDeposits;
      }

      return getAvailableDeposits(allRawDeposits);
    }

    const rawDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDeposits",
      args: [address],
    });

    if (rawDeposits instanceof Error) {
      throw rawDeposits;
    }

    return getAvailableDeposits(rawDeposits);
  }, [readOnce, address]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetchDeposits()
      .then(setDeposits)
      .finally(() => setIsLoading(false))
      .catch((error) => {
        setError(error);

        toast({
          title: "Unable to Fetch Deposits",
          description: error.message,
          variant: "destructive",
          action: (
            <ToastAction altText="Reload deposits" onClick={refresh}>
              Retry
            </ToastAction>
          ),
        });
      });
  }, [fetchDeposits, toast]);

  // Automatically reload deposits when the component mounts.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isLoading, error, deposits, refresh, setDeposits };
};

type RawDeposits = readonly {
  depositId: bigint;
  tokenAddress: `0x${string}`;
  owner: `0x${string}`;
  priceInUsd: bigint;
  amount: bigint;
  startTimestamp: bigint;
  unlockTimestamp: bigint;
  withdrawn: boolean;
}[];

function getAvailableDeposits(rawDeposits: RawDeposits): Deposit[] {
  const availableDeposits: Deposit[] = [];

  for (const rawDeposit of rawDeposits) {
    if (rawDeposit.withdrawn) {
      continue;
    }

    availableDeposits.push({
      amount: new BN(rawDeposit.amount.toString()),
      initialPrice: new BN(rawDeposit.priceInUsd.toString()),
      depositId: rawDeposit.depositId,
      tokenAddress: rawDeposit.tokenAddress,
      startTimestamp: Number(rawDeposit.startTimestamp),
      unlockTimestamp: Number(rawDeposit.unlockTimestamp),
    });
  }

  return availableDeposits;
}

export default useDeposits;
