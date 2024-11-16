"use client";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "viem/chains";
import { ToastProvider, ToastProvider2 } from "@/components/Toast";

const wagmiConfig = getDefaultConfig({
  appName: "ERC20 Vault",
  projectId: "0c145e73f74608526249fa5c8ab223a0",
  chains: [mainnet, sepolia],
  // If your dApp uses server side rendering (SSR).
  ssr: true,
});

const queryClient = new QueryClient();

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ToastProvider2>{children}</ToastProvider2>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
