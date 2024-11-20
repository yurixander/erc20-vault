"use client";

import { FC, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import UnlockDeposit from "./UnlockDeposit";
import { Deposit } from "@/config/types";
import { convertBNToAmount } from "@/utils/amount";
import CircularProgress from "./CircularProgress";
import { LINK_ERC20_TOKEN } from "@/config/constants";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";
import { generateTimeRemaining, generateUnlockStatus } from "@/utils/time";

type DepositsTableProps = {
  deposits: Deposit[];
  className?: string;
};

const TOKEN_ICON_SIZE = 16;

// TODO: Change this in the future to the token that each deposit has saved in its type.
export const TEMP_TABLE_TOKEN = LINK_ERC20_TOKEN;

const columnHelper = createColumnHelper<Deposit>();

const COLUMNS_ID = {
  TOKEN: "token",
  AMOUNT: "amount",
  UNLOCK_STATUS: "unlockStatus",
  TIME_REMAINING: "timeRemaining",
  INDEX: "index",
};

const DepositsTable: FC<DepositsTableProps> = ({ deposits, className }) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: COLUMNS_ID.TOKEN,
        header: "Token",
        cell: () => (
          <div className="flex items-center gap-2 font-medium max-h-max">
            <Image
              src={TEMP_TABLE_TOKEN.iconAssetPath}
              alt="Temporary icon"
              width={TOKEN_ICON_SIZE}
              height={TOKEN_ICON_SIZE}
            />

            <span className="leading-tight">{TEMP_TABLE_TOKEN.name}</span>
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) =>
          convertBNToAmount(info.getValue(), TEMP_TABLE_TOKEN.decimals),
      }),
      columnHelper.accessor(
        (row) => generateUnlockStatus(row.startTimestamp, row.unlockTimestamp),
        {
          id: COLUMNS_ID.UNLOCK_STATUS,
          header: "Unlock Status",
          cell: ({ getValue }) => {
            return (
              <div className="flex items-center gap-x-2 lg:w-auto w-[90%]">
                <CircularProgress
                  progress={getValue()}
                  size={18}
                  strokeWidth={3}
                />

                <span>{getValue()}%</span>
              </div>
            );
          },
        }
      ),
      columnHelper.display({
        id: COLUMNS_ID.TIME_REMAINING,
        header: "Time Remaining",
        cell: ({ row }) => generateTimeRemaining(row.original.unlockTimestamp),
      }),
      columnHelper.accessor("index", {
        header: "",
        cell: ({ getValue, row }) => {
          const isReadyToUnlock =
            row.getValue(COLUMNS_ID.UNLOCK_STATUS) === 100;

          return (
            <UnlockDeposit
              depositIndex={getValue()}
              disabled={!isReadyToUnlock}
            />
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: deposits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: [{ id: COLUMNS_ID.UNLOCK_STATUS, desc: true }],
    },
  });

  return (
    <Table className={twMerge("border", className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepositsTable;
