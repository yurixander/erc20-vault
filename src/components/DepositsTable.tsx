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
} from "@tanstack/react-table";

type DepositsTableProps = {
  deposits: Deposit[];
  className?: string;
};

const TOKEN_ICON_SIZE = 16;

// TODO: Change this in the future to the token that each deposit has saved in its type.
export const TEMP_TABLE_TOKEN = LINK_ERC20_TOKEN;

const columnHelper = createColumnHelper<Deposit>();

const DepositsTable: FC<DepositsTableProps> = ({ deposits, className }) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "token",
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
      columnHelper.display({
        id: "unlockStatus",
        header: "Unlock Status",
        cell: () => {
          const PROGRESS = 65;

          return (
            <div className="flex items-center gap-x-2 lg:w-auto w-[90%]">
              <CircularProgress progress={PROGRESS} size={18} strokeWidth={3} />

              <span>{PROGRESS}%</span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "timeRemaining",
        header: "Time Remaining",
        cell: () => {
          const timeRemaining = generateRemaining();

          return timeRemaining === 0
            ? "Ready to unlock"
            : `${timeRemaining} hours`;
        },
      }),
      columnHelper.accessor("index", {
        header: "",
        cell: (info) => (
          <UnlockDeposit depositIndex={info.getValue()} disabled={true} />
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: deposits,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

function generateRemaining(): number {
  return 10;
}

export default DepositsTable;
