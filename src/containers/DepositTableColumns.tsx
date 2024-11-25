import CircularProgress from "@/components/CircularProgress";
import UnlockDeposit from "@/components/UnlockDeposit";
import { LINK_ERC20_TOKEN } from "@/config/constants";
import { Deposit } from "@/config/types";
import { convertBNToAmount } from "@/utils/amount";
import { generateUnlockStatus, generateTimeRemaining } from "@/utils/time";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";

const columnHelper = createColumnHelper<Deposit>();

const TOKEN_ICON_SIZE = 16;

export const COLUMNS_ID = {
  TOKEN: "token",
  AMOUNT: "amount",
  UNLOCK_STATUS: "unlockStatus",
  TIME_REMAINING: "timeRemaining",
  INDEX: "index",
};

// TODO: Change this in the future to the token that each deposit has saved in its type.
export const TEMP_TABLE_TOKEN = LINK_ERC20_TOKEN;

const DEPOSIT_TABLE_COLUMNS: ColumnDef<Deposit, any>[] = [
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
            <CircularProgress progress={getValue()} size={18} strokeWidth={3} />

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
      const isReadyToUnlock = row.getValue(COLUMNS_ID.UNLOCK_STATUS) === 100;

      return (
        <UnlockDeposit
          className="w-full"
          depositIndex={getValue()}
          disabled={!isReadyToUnlock}
        />
      );
    },
  }),
];

export default DEPOSIT_TABLE_COLUMNS;
