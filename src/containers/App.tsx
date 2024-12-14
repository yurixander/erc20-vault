import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/Sidebar";
import { FC } from "react";
import DepositsTable from "./DepositsTable";
import DepositModal from "@/components/DepositModal/DepositModal";
import { useAccount } from "wagmi";
import Button from "@/components/Button";
import { FiPlusCircle } from "react-icons/fi";

const App: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen w-full flex-col sm:flex-row">
      <aside className="hidden size-full max-w-64 grow flex-col bg-blue-600 md:flex dark:bg-blue-00">
        <AppSidebar className="grow" />
      </aside>

      <section className="relative flex w-full grow flex-col">
        {/** Background */}
        <div className="-z-1 pointer-events-none absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-20" />

        <header className="z-0 h-16 w-full sm:h-20 sm:border-b sm:border-b-gray-200 md:h-24 dark:sm:border-b-gray-200/50">
          <Navbar />
        </header>

        <main className="z-0 flex size-full grow basis-0 flex-col gap-8 p-5">
          <DepositModal>
            <Button disabled={!isConnected} className="w-max">
              <FiPlusCircle />

              <span>Create a new deposit</span>
            </Button>
          </DepositModal>

          <DepositsTable />
        </main>
      </section>
    </div>
  );
};

export default App;
