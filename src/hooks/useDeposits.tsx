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
      throw new Error("No account connected");
    }

    const rawDeposits = await readOnce({
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "getDeposits",
      args: [address],
    });

    if (rawDeposits instanceof Error) {
      throw rawDeposits;
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

  return { isLoading, error, deposits, refresh };
};

export default useDeposits;
