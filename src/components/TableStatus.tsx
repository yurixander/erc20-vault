import { Heading, Text } from "./Typography";
import { FC } from "react";
import { FaSearch } from "react-icons/fa";

type Props = {
  title: string;
  description: string;
};

const TableStatus: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <FaSearch size={24} />

      <Heading level="h4" align="center">
        {title}
      </Heading>

      <Text align="center">{description}</Text>
    </div>
  );
};

export default TableStatus;
