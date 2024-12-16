import { Text } from "@/components/Typography";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { IoMdRemove, IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";

const DevPreview: FC = () => {
  return (
    <>
      <div className="m-8 flex flex-col gap-4">
        <ProfitOrLossIndicator percentage={0.1} />

        <ProfitOrLossIndicator percentage={1.45} />

        <ProfitOrLossIndicator percentage={-13.31} />

        <ProfitOrLossIndicator percentage={0.0} />
      </div>
    </>
  );
};

const ProfitOrLossIndicator: FC<{
  percentage: number;
}> = ({ percentage }) => {
  return (
    <Text
      className={cn(
        "flex w-[88px] select-text items-center justify-center space-x-1 rounded-md px-2 py-1",
        percentage > 0
          ? "bg-green-100 text-green-800 selection:bg-green-300"
          : percentage < 0
            ? "bg-red-100 text-red-800 selection:bg-red-300"
            : "bg-neutral-200 text-neutral-800 selection:bg-neutral-300",
      )}
    >
      {percentage > 0 ? (
        <IoMdTrendingUp className="size-4" />
      ) : percentage < 0 ? (
        <IoMdTrendingDown className="size-4" />
      ) : (
        <IoMdRemove />
      )}
      <b className="font-medium">{percentage.toFixed(2)}%</b>
    </Text>
  );
};

export default DevPreview;
