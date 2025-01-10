import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/Sidebar";
import { FC } from "react";
import DepositsTable from "./DepositsTable";
import DepositModal from "@/components/DepositModal/DepositModal";
import { useAccount } from "wagmi";
import Button from "@/components/Button";
import { FiPlusCircle } from "react-icons/fi";
import SwitchTheme from "@/components/SwitchTheme";

const App: FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden sm:flex-row">
      <aside className="hidden size-full flex-col bg-blue-600 sm:w-56 md:flex md:w-64 dark:bg-blue-00">
        <AppSidebar className="grow" />
      </aside>

      <section className="relative flex flex-1 flex-col overflow-hidden">
        {/** Background */}
        <div className="-z-1 pointer-events-none absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-20" />

        <header className="z-0 h-16 w-full sm:h-20 sm:border-b sm:border-b-gray-200 md:h-24 dark:sm:border-b-gray-200/50">
          <Navbar />
        </header>

        <main className="z-0 flex size-full grow basis-0 flex-col gap-8 p-5">
          <div className="flex w-full">
            <DepositModal>
              <Button disabled={!isConnected} className="w-max">
                <FiPlusCircle />

                <span>Create a new deposit</span>
              </Button>
            </DepositModal>
            <div className="w-full text-right">
              <SwitchTheme />
            </div>
          </div>

          <DepositsTable />
        </main>
      </section>
    </div>
  );
};

export default App;
