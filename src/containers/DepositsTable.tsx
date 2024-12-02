import React, { FC, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { twMerge } from "tailwind-merge";
import { Deposit } from "@/config/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationSelector,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Pagination";
import DEPOSIT_TABLE_COLUMNS, { COLUMNS_ID } from "./DepositTableColumns";

type DepositsTableProps = {
  deposits: Deposit[];
  className?: string;
};

const PAGE_SIZE = 8;

const DepositsTable: FC<DepositsTableProps> = ({ deposits, className }) => {
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
        )
      ),
    [pagination.pageIndex, table]
  );

  return (
    <div className="flex flex-col gap-y-4 max-w-6xl justify-center mb-4">
      <Table
        className={twMerge("border min-w-[640px] md:min-w-full", className)}
      >
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
    (_, index) => startPage + index
  );
}

export default DepositsTable;
