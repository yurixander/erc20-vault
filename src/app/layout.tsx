// Styles.
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Footer from "../containers/Footer";
import { twMerge } from "tailwind-merge";
import AppMenu from "@/components/AppMenu";
import AppSidebar from "@/components/AppSidebar";

const APP_NAME = "ERC20 Vault";
const INTER = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Lock ERC20 tokens in a vault for a specified period of time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={twMerge("min-h-screen", INTER.className)}>
        <Providers>
          <div className="h-screen w-full flex flex-col sm:flex-row">
            <aside className="w-72 size-full grow flex-col bg-blue-600 dark:bg-blue-700 hidden md:flex">
              <AppSidebar className="grow" />

              <Footer className="text-white border-t border-t-blue-300/80" />
            </aside>

            <section className="flex flex-col grow w-full">
              <header className="w-full h-16 sm:h-20 md:h-24 sm:border-b sm:border-b-gray-200 dark:sm:border-b-gray-200/50">
                <AppMenu />
              </header>

              <div className="flex flex-col grow overflow-hidden basis-0">
                <div className="grow overflow-y-auto px-4 pt-2">{children}</div>

                <Footer className="text-foreground md:hidden" />
              </div>
            </section>
          </div>
        </Providers>
      </body>
    </html>
  );
}
