import { Deposit } from "@/config/types";
import useToast from "@/hooks/useToast";
import { FC, useCallback, useEffect, useState } from "react";
import useDeposits, {
  AccountNotFoundError,
  FetchDepositsError,
} from "../hooks/useDeposits";
import DepositsTable from "./DepositsTable";
import { ToastAction } from "@/components/Toast";
import { useAccount, useWatchContractEvent } from "wagmi";
import VAULT_ABI from "@/abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import { decodeEventLog } from "viem";
import { getTokenByAddress } from "@/utils/findTokenByAddress";
import { convertBNToAmount } from "@/utils/amount";
import { BN } from "bn.js";

const Deposits: FC = () => {
  const fetchDeposits = useDeposits();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isDepositsLoading, setIsDepositsLoading] = useState(true);
  const { toast } = useToast();
  const { address } = useAccount();

  useWatchContractEvent({
    abi: VAULT_ABI,
    address: VAULT_CONTRACT_ADDRESS,
    eventName: "DepositMade",
    syncConnectedChain: true,
    onLogs: (logs) => {
      for (const log of logs) {
        const { args } = decodeEventLog({
          abi: VAULT_ABI,
          eventName: "DepositMade",
          data: log.data,
          topics: log.topics,
        });

        if (args.account !== address) {
          continue;
        }

        const { id, decimals } = getTokenByAddress(args.tokenAddress);

        const amount = convertBNToAmount(
          new BN(args.amount.toString()),
          decimals,
        );

        toast({
          title: "New deposit",
          description: `You've made a deposit of ${amount} ${id}`,
        });

        fetchDeposits !== null && fetchDeposits();
      }
    },
  });

  useWatchContractEvent({
    abi: VAULT_ABI,
    address: VAULT_CONTRACT_ADDRESS,
    eventName: "WithdrawalMade",
    syncConnectedChain: true,
    onLogs: (logs) => {
      for (const log of logs) {
        const { args } = decodeEventLog({
          abi: VAULT_ABI,
          eventName: "WithdrawalMade",
          data: log.data,
          topics: log.topics,
        });

        if (args.account !== address) {
          continue;
        }

        const { id, decimals } = getTokenByAddress(args.tokenAddress);

        const amount = convertBNToAmount(
          new BN(args.amount.toString()),
          decimals,
        );

        toast({
          title: "Withdrawal Success",
          description: `You already withdraw ${amount} ${id}`,
        });

        setDeposits((prevDeposits) =>
          prevDeposits.filter(({ depositId }) => depositId !== args.depositId),
        );
      }
    },
  });

  const reloadDeposits = useCallback(() => {
    if (fetchDeposits === null) {
      return;
    }

    fetchDeposits()
      .then(setDeposits)
      .finally(() => setIsDepositsLoading(false))
      .catch((error) => {
        if (error instanceof AccountNotFoundError) {
          toast({
            title: "Account not found",
            description: error.message,
            variant: "destructive",
          });
        } else if (error instanceof FetchDepositsError) {
          toast({
            title: "Fetch deposits error",
            description: error.message,
            variant: "destructive",
            action: (
              <ToastAction altText="Reload deposits" onClick={reloadDeposits}>
                Reload
              </ToastAction>
            ),
          });
        } else {
          toast({
            title: "Unexpected error",
            description: "A error occurred while fetching deposits.",
            variant: "destructive",
          });

          console.error(error);
        }
      });
  }, [fetchDeposits, toast]);

  useEffect(() => reloadDeposits(), [reloadDeposits]);

  return (
    <div className="flex flex-col gap-2">
      {!isDepositsLoading && (
        <DepositsTable deposits={deposits} onReload={() => reloadDeposits()} />
      )}
    </div>
  );
};

export default Deposits;
