import { FC } from "react";
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
import { AssetPath, Deposit } from "@/config/types";
import { convertBNToAmount } from "@/utils/amount";
import CircularProgress from "./CircularProgress";

type DepositsTableProps = {
  deposits: Deposit[];
  className?: string;
};

const DepositsTable: FC<DepositsTableProps> = ({ deposits, className }) => {
  return (
    <Table className={twMerge("border", className)}>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Unlock Status</TableHead>
          <TableHead>Time Remaining</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {deposits.map((deposit) => (
          <TableRow key={deposit.index}>
            <TableCell>
              <div className="flex  items-center gap-2 font-medium max-h-max">
                <Image
                  src={AssetPath.LINK}
                  alt="Temporary icon"
                  width={16}
                  height={16}
                />
                <span className=" leading-tight">Chainlink</span>
              </div>
            </TableCell>

            <TableCell>{convertBNToAmount(deposit.amount, 18)}</TableCell>

            <TableCell>
              <div className="flex items-center gap-x-2 lg:w-auto w-[90%]">
                <CircularProgress progress={65} size={18} strokeWidth={3} />

                <span>65%</span>
              </div>
            </TableCell>

            <TableCell>10 hours</TableCell>

            <TableCell className="text-right">
              <UnlockDeposit depositIndex={deposit.index} disabled={true} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepositsTable;
