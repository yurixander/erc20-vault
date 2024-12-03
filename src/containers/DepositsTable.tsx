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
import { Heading, Text } from "@/components/Typography";
import { Deposit } from "@/config/types";
import {
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { FC, useMemo, useState } from "react";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { TfiReload } from "react-icons/tfi";
import { twMerge } from "tailwind-merge";
import DEPOSIT_TABLE_COLUMNS, { COLUMNS_ID } from "./DepositTableColumns";

type DepositsTableProps = {
  deposits: Deposit[];
  onReload: () => void;
  className?: string;
};

const PAGE_SIZE = 8;

const DepositsTable: FC<DepositsTableProps> = ({
  deposits,
  className,
  onReload,
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data: deposits,
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

  if (deposits.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-sm border border-gray-200 bg-gray-50">
        <HiOutlineBanknotes className="size-16" />

        <Heading level="h4" align="center">
          There are no deposits
        </Heading>

        <Text align="center">Add your first deposit to get started</Text>
      </div>
    );
  }

  return (
    <div className="mb-4 flex max-w-6xl flex-col justify-center gap-y-4">
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
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={
                    cell.column.id === COLUMNS_ID.DEPOSIT_ID
                      ? "w-[100px]"
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          onClick={onReload}
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
