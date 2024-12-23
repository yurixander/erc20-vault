import { FC } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/Table";
import { cn } from "@utils/utils";

const DepositTableSkeleton: FC = () => {
  return (
    <div className="mb-4 flex max-w-6xl flex-col justify-center gap-y-4">
      <Skeleton className="h-6 w-20" />

      <Table className="min-w-[640px] border md:min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Unlock Status</TableHead>
            <TableHead>Time Remaining</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />

                  <Skeleton className="h-4 w-16" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />

                  <Skeleton className="h-4 w-12" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-8 w-20 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-400/80 dark:bg-gray-400/50",
        className,
      )}
      {...props}
    />
  );
}

export default DepositTableSkeleton;
