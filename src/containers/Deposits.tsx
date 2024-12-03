import { Deposit } from "@/config/types";
import useToast from "@/hooks/useToast";
import { FC, useCallback, useEffect, useState } from "react";
import useDeposits, {
  AccountNotFoundError,
  FetchDepositsError,
} from "../hooks/useDeposits";
import DepositsTable from "./DepositsTable";

const Deposits: FC = () => {
  const fetchDeposits = useDeposits();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isDepositsLoading, setIsDepositsLoading] = useState(true);
  const { toast } = useToast();

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
