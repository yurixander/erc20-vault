import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/Sidebar";
import { FC } from "react";
import DepositsTable from "./DepositsTable";
import { useAccount } from "wagmi";
import WelcomeSplash from "@/components/WelcomeSplash";

const App: FC = () => {
  const { isConnected } = useAccount();
  return (
    <div className="flex h-screen w-full flex-col sm:flex-row">
      <aside className="hidden size-full max-w-xs grow flex-col bg-blue-600 sm:flex dark:bg-blue-300">
        <AppSidebar className="grow" />
      </aside>

      <section className="relative flex w-full grow flex-col">
        {/** Background */}
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-1" />

        <header className="h-16 w-full sm:h-20 sm:border-b sm:border-b-gray-200 md:h-24 dark:sm:border-b-gray-200/50 z-0">
          <Navbar />
        </header>

        <main className="grow basis-0 flex size-full flex-col gap-8 z-0 p-5">
          {isConnected ? <DepositsTable /> : <WelcomeSplash />}
        </main>
      </section>
    </div>
  );
};

export default App;
