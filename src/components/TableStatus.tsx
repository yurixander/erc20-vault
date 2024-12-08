import { HiOutlineBanknotes } from "react-icons/hi2";
import { Heading, Text } from "./Typography";
import { FC } from "react";

type Props = {
  title: string;
  description: string;
};

const TableStatus: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center rounded-sm border border-gray-200 bg-gray-50">
      <HiOutlineBanknotes className="size-16" />

      <Heading level="h4" align="center">
        {title}
      </Heading>

      <Text align="center">{description}</Text>
    </div>
  );
};

export default TableStatus;
