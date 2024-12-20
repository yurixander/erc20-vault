import { Toaster } from "@/components/Toast";
import { EnvKey, requireEnvVariable } from "@/config/env";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { http, fallback } from "viem";

export const wagmiConfig = getDefaultConfig({
  appName: "ERC20 Vault",
  projectId: "0c145e73f74608526249fa5c8ab223a0",
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: fallback([
      http(
        `
        https://flashy-palpable-shard.ethereum-sepolia.quiknode.pro/${requireEnvVariable(EnvKey.QuickNodeKey)}
        `,
        { batch: true, key: "alchemy", name: "Alchemy HTTP Provider" },
      ),
      http(),
    ]),
    [mainnet.id]: fallback([
      http(
        `https://flashy-palpable-shard.quiknode.pro/${requireEnvVariable(EnvKey.QuickNodeKey)}`,
        {
          batch: true,
          key: "alchemy",
          name: "Alchemy HTTP Provider",
        },
      ),
      http(),
    ]),
  },
});

const queryClient = new QueryClient();

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={sepolia}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>

      <Toaster />
    </>
  );
};

export default Providers;
