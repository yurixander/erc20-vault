import Providers from "@/containers/Providers";
import AppSidebar from "@/components/AppSidebar";
import { FC } from "react";
import Footer from "./Footer";
import AppMenu from "@/components/AppMenu";
import { Heading, Text } from "@/components/Typography";
import AccountDetail from "@/components/AccountDetail";
import DepositButton from "./DepositButton";
import Deposits from "./Deposits";

const App: FC = () => {
  return (
    <Providers>
      <div className="h-screen w-full flex flex-col sm:flex-row">
        <aside className="w-72 size-full grow flex-col bg-blue-600 dark:bg-blue-800 hidden sm:flex">
          <AppSidebar className="grow" />

          <Footer className="text-white border-t border-t-blue-300/80" />
        </aside>

        <section className="flex flex-col grow w-full">
          <header className="w-full h-16 sm:h-20 md:h-24 sm:border-b sm:border-b-gray-200 dark:sm:border-b-gray-200/50">
            <AppMenu />
          </header>

          <div className="flex flex-col grow overflow-hidden basis-0">
            <div className="grow overflow-y-auto px-4 pt-2">
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
            </div>

            <Footer className="text-foreground md:hidden" />
          </div>
        </section>
      </div>
    </Providers>
  );
};

export default App;
