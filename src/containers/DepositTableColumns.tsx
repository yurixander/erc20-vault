import CircularProgress from "@/components/CircularProgress";
import UnlockDeposit from "@/components/UnlockDeposit";
import { Deposit } from "@/config/types";
import { convertBNToAmount } from "@/utils/amount";
import { getTokenByAddress } from "@/utils/findTokenByAddress";
import { generateTimeRemaining, generateUnlockStatus } from "@/utils/time";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Deposit>();

const TOKEN_ICON_SIZE = 16;

export const COLUMNS_ID = {
  TOKEN: "tokenAddress",
  AMOUNT: "amount",
  UNLOCK_STATUS: "unlockStatus",
  TIME_REMAINING: "timeRemaining",
  DEPOSIT_ID: "depositId",
};

const DEPOSIT_TABLE_COLUMNS: ColumnDef<Deposit, any>[] = [
  columnHelper.accessor("tokenAddress", {
    header: "Token",
    cell: ({ row }) => {
      const token = getTokenByAddress(row.original.tokenAddress);

      return (
        <div className="flex max-h-max items-center gap-2 font-medium">
          <img
            src={token.iconAssetPath}
            alt={`Logo of ${token.name}`}
            width={TOKEN_ICON_SIZE}
            height={TOKEN_ICON_SIZE}
          />

          <span className="leading-tight">{token.name}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue, row }) =>
      convertBNToAmount(
        getValue(),
        getTokenByAddress(row.original.tokenAddress).decimals,
      ),
  }),
  columnHelper.accessor(
    (row) => generateUnlockStatus(row.startTimestamp, row.unlockTimestamp),
    {
      id: COLUMNS_ID.UNLOCK_STATUS,
      header: "Unlock Status",
      cell: ({ getValue }) => {
        return (
          <div className="flex w-[90%] items-center gap-x-2 lg:w-auto">
            <CircularProgress progress={getValue()} size={18} strokeWidth={3} />

            <span>{getValue()}%</span>
          </div>
        );
      },
    },
  ),
  columnHelper.display({
    id: COLUMNS_ID.TIME_REMAINING,
    header: "Time Remaining",
    cell: ({ row }) => generateTimeRemaining(row.original.unlockTimestamp),
  }),
  columnHelper.accessor("depositId", {
    header: "",
    cell: ({ getValue, row }) => {
      const isReadyToUnlock = row.getValue(COLUMNS_ID.UNLOCK_STATUS) === 100;

      return (
        <UnlockDeposit
          className="w-full"
          tokenAddress={row.original.tokenAddress}
          depositId={getValue()}
          disabled={!isReadyToUnlock}
        />
      );
    },
  }),
];

export default DEPOSIT_TABLE_COLUMNS;
