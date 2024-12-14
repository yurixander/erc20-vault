import Button from "@/components/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationSelector,
} from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import {
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { FC, useMemo, useState } from "react";
import { TfiReload } from "react-icons/tfi";
import { twMerge } from "tailwind-merge";
import DEPOSIT_TABLE_COLUMNS, { COLUMNS_ID } from "./DepositTableColumns";
import useDeposits from "../hooks/useDeposits";
import TableStatus from "../components/TableStatus";
import { useAccount, useWatchContractEvent } from "wagmi";
import VAULT_ABI from "@/abi/vaultAbi";
import { VAULT_CONTRACT_ADDRESS } from "@/config/constants";
import { decodeEventLog } from "viem";
import { getTokenByAddress } from "@/utils/findTokenByAddress";
import { convertBNToAmount } from "@/utils/amount";
import { BN } from "bn.js";
import useToast from "@/hooks/useToast";
import { Deposit } from "@/config/types";
import DepositTableSkeleton from "@/containers/DepositTableSkeleton";
import { Heading } from "@/components/Typography";
import { cn } from "@/lib/utils";

type DepositsTableProps = {
  className?: string;
};

const PAGE_SIZE = 8;

const DepositsTable: FC<DepositsTableProps> = ({ className }) => {
  const { deposits, isLoading, error, refresh, setDeposits } = useDeposits();
  const { toast } = useToast();
  const { address } = useAccount();

  useWatchContractEvent({
    abi: VAULT_ABI,
    address: VAULT_CONTRACT_ADDRESS,
    eventName: "DepositMade",
    syncConnectedChain: true,
    onLogs: async (logs) => {
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
          description: `You've made a deposit of ${amount} (ID #${id})`,
        });

        setDeposits((prevDeposits) => {
          const newDeposit: Deposit = {
            amount: new BN(args.amount.toString()),
            depositId: args.depositId,
            tokenAddress: args.tokenAddress,
            startTimestamp: Number(args.startTimestamp),
            unlockTimestamp: Number(args.unlockTimestamp),
          };

          if (prevDeposits === null) {
            return [newDeposit];
          }

          return prevDeposits.concat(newDeposit);
        });
      }
    },
  });

  useWatchContractEvent({
    abi: VAULT_ABI,
    address: VAULT_CONTRACT_ADDRESS,
    eventName: "WithdrawalMade",
    syncConnectedChain: true,
    strict: true,
    onError(error) {
      console.error(error);
    },
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
          description: `You withdrew ${amount} ${id}`,
        });

        setDeposits((prevDeposits) => {
          if (prevDeposits === null) {
            return null;
          }

          return prevDeposits.filter(
            ({ depositId }) => depositId !== args.depositId,
          );
        });
      }
    },
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const rows = useMemo(() => {
    if (deposits === null) {
      return [];
    }

    return deposits;
  }, [deposits]);

  const table = useReactTable({
    data: rows,
    columns: DEPOSIT_TABLE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    initialState: {
      sorting: [{ id: COLUMNS_ID.UNLOCK_STATUS, desc: true }],
    },
    state: {
      pagination: pagination,
    },
  });

  const paginationElements: React.JSX.Element[] = useMemo(
    () =>
      renderPageNumbers(pagination.pageIndex, table.getPageCount()).map(
        (paginationIndex) => (
          <PaginationItem key={paginationIndex}>
            <PaginationSelector
              onClick={() => table.setPageIndex(paginationIndex)}
              isActive={pagination.pageIndex === paginationIndex}
            >
              {paginationIndex}
            </PaginationSelector>
          </PaginationItem>
        ),
      ),
    [pagination.pageIndex, table],
  );

  if (error !== null) {
    return (
      <TableStatus
        title="Unable to Fetch Deposits"
        description={error.message}
      />
    );
  } else if (isLoading) {
    return <DepositTableSkeleton />;
  } else if (rows.length === 0) {
    return (
      <TableStatus
        title="No Deposits"
        description="Create your first deposit to get started!"
      />
    );
  }

  return (
    <div className="mb-4 flex max-w-6xl flex-col justify-center gap-y-4">
      <Heading level="h5">
        {address === undefined ? "Global Deposits" : "Your Deposits"}:
      </Heading>

      <Table
        className={twMerge("min-w-[640px] border md:min-w-full", className)}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(({ id, column, getContext }) => (
                <TableCell
                  key={id}
                  className={cn(
                    column.id === COLUMNS_ID.DEPOSIT_ID && "w-[100px]",
                    column.id === COLUMNS_ID.DEPOSIT_ID &&
                      address === undefined &&
                      "[&>button]:pointer-events-none [&>button]:opacity-50",
                  )}
                >
                  {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {paginationElements}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Button
          size="icon"
          className="shrink-0"
          variant="outline"
          onClick={refresh}
        >
          <TfiReload />
        </Button>
      </div>
    </div>
  );
};

const PAGINATION_RANGE = 4;

function renderPageNumbers(currentPage: number, totalPages: number) {
  let startPage = Math.max(0, currentPage - Math.floor(PAGINATION_RANGE / 2));
  let endPage = Math.min(totalPages, startPage + PAGINATION_RANGE);

  if (endPage - startPage < PAGINATION_RANGE) {
    startPage = Math.max(0, endPage - PAGINATION_RANGE);
  }

  return Array.from(
    { length: endPage - startPage },
    (_, index) => startPage + index,
  );
}

export default DepositsTable;
