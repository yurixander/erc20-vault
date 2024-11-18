"use client";

import { FC, useCallback, useMemo } from "react";
import { Deposit } from "../config/types";
import DepositListItem from "./DepositListItem";
import { FiAlertCircle, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import Skeleton from "./SkeletonLoader";
import Alert from "./Alert";
import AlertTitle from "./Alert/AlertTitle";
import AlertDescription from "./Alert/AlertDescription";
import Button from "./Button";

type DepositListProps = {
  title: string;
  deposits: Deposit[] | Error | null;
  emptyMessage?: string;
  onRefresh: (() => void) | null;
};

const DepositList: FC<DepositListProps> = ({
  title,
  deposits,
  emptyMessage = "Nothing here yet",
  onRefresh,
}) => {
  // Sort deposits by progress (those closest to unlocking first).
  const sortedDeposits = useMemo(() => {
    if (!Array.isArray(deposits)) {
      return deposits;
    }

    return deposits.sort((a, b) => a.unlockTimestamp - b.unlockTimestamp);
  }, [deposits]);

  const handleRefresh = useCallback(() => {
    if (onRefresh === null) {
      return;
    }

    onRefresh();
  }, [onRefresh]);

  // TODO: Add state for when there's no account connected.
  return (
    <div className="flex flex-col items-start justify-center gap-2 w-full">
      <div className="flex justify-between items-center w-full">
        <h3>{title}</h3>

        <Button
          // Disable the refresh button while the deposits are loading,
          // or if the refresh function is not yet available.
          disabled={sortedDeposits === null || onRefresh === null}
          onClick={handleRefresh}
          variant="outline"
          className="min-w-[100px]"
        >
          <FiRefreshCw />
        </Button>
      </div>

      <ul className="flex flex-col items-center justify-center gap-2 max-h-[300px] overflow-y-auto w-full">
        {sortedDeposits === null ? (
          <Skeleton className="min-h-[200px] w-full" />
        ) : sortedDeposits instanceof Error ? (
          <Alert variant="destructive">
            <FiAlertTriangle />

            <AlertTitle>Heads up!</AlertTitle>

            <AlertDescription>
              An error occurred while fetching deposits:{" "}
              {sortedDeposits.message}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {sortedDeposits.map((deposit) => (
              <DepositListItem key={deposit.index} deposit={deposit} />
            ))}

            {sortedDeposits.length === 0 && (
              <Alert>
                <FiAlertCircle />

                <AlertDescription>{emptyMessage}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default DepositList;
