import AccountDetail from "@/components/AccountDetail";
import AppMenu from "@/components/AppMenu";
import AppSidebar from "@/components/AppSidebar";
import { Heading, Text } from "@/components/Typography";
import Providers from "@/containers/Providers";
import { FC } from "react";
import DepositButton from "./DepositButton";
import Deposits from "./Deposits";

const App: FC = () => {
  return (
    <Providers>
      <div className="flex h-screen w-full flex-col sm:flex-row">
        <aside className="hidden size-full w-72 grow flex-col bg-blue-600 sm:flex dark:bg-blue-800">
          <AppSidebar className="grow" />
        </aside>

        <section className="flex w-full grow flex-col">
          <header className="h-16 w-full sm:h-20 sm:border-b sm:border-b-gray-200 md:h-24 dark:sm:border-b-gray-200/50">
            <AppMenu />
          </header>

          <div className="flex grow basis-0 flex-col overflow-hidden">
            <div className="grow overflow-y-auto px-4 pt-2">
              <main className="flex size-full flex-col gap-8 pt-1">
                <div className="flex w-max flex-col gap-1">
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
            </div>
          </div>
        </section>
      </div>
    </Providers>
  );
};

export default App;
