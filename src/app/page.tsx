import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Deposits from "../containers/Deposits";
import DepositButton from "../containers/DepositButton";

const Home: FC = () => {
  return (
    <main className="size-full flex flex-col items-center justify-center pt-6">
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-2xl">ERC-20 Vault</h1>

        <p>Connect your wallet to get started.</p>
      </div>

      <div className="flex items-center justify-center gap-2 ">
        <ConnectButton />

        <DepositButton />
      </div>

      <Deposits />
    </main>
  );
};

export default Home;
