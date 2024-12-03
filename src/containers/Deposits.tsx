import { FC } from "react";
import useDeposits from "../hooks/useDeposits";
import DepositsTable from "./DepositsTable";

const Deposits: FC = () => {
  const { deposits } = useDeposits();

  return (
    <div>
      {!(deposits instanceof Error) && deposits !== null && (
        <DepositsTable deposits={[]} />
      )}
    </div>
  );
};

export default Deposits;
