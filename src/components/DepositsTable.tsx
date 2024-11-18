import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { twMerge } from "tailwind-merge";
import { Erc20Token } from "@/config/types";
import Image from "next/image";
import UnlockDeposit from "./UnlockDeposit";

export type Deposit = {
  id: string;
  token: Erc20Token;
  amount: string;
  unlockPercentage: number;
  timeRemaining: string;
};

type DepositsTableProps = {
  deposits: Deposit[];
  className?: string;
};

const DepositsTable: FC<DepositsTableProps> = ({ deposits, className }) => {
  return (
    <Table className={twMerge("border", className)}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Token</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Unlock Status</TableHead>
          <TableHead>Time Remaining</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {deposits.map((deposit) => (
          <TableRow key={deposit.id}>
            <TableCell>
              <Image
                src={deposit.token.iconSrc}
                alt={`${deposit.token.name} icon`}
                width={24}
                height={24}
              />
            </TableCell>

            <TableCell className="font-medium">{deposit.token.name}</TableCell>

            <TableCell>{deposit.amount}</TableCell>

            <TableCell>
              <div className="flex items-center gap-x-2 lg:w-auto w-[90%]">
                <Progress
                  value={deposit.unlockPercentage}
                  className="lg:w-[60%]"
                />

                <span className="text-sm text-muted-foreground">
                  {deposit.unlockPercentage}%
                </span>
              </div>
            </TableCell>

            <TableCell>{deposit.timeRemaining}</TableCell>

            <TableCell className="text-right">
              <UnlockDeposit deposit={deposit} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepositsTable;
