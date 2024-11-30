import { FC } from "react";
import Deposits from "../containers/Deposits";
import DepositButton from "../containers/DepositButton";
import AccountDetail from "@/components/AccountDetail";
import { Heading, Text } from "@/components/Typography";

const Home: FC = () => {
  return (
    <main className="size-full flex flex-col pt-1 gap-8">
      <div className="flex flex-col gap-1 w-max">
        <div className="flex flex-col">
          <Heading>ERC-20 Vault</Heading>

          <Text>Connect your wallet to get started.</Text>
        </div>

        <div className="flex items-center justify-center gap-2 ">
          <AccountDetail />

          <DepositButton />
        </div>
      </div>

      <Deposits />
    </main>
  );
};

export default Home;
