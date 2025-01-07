import { Toaster } from "@/components/Toast";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { webSocket } from "@wagmi/core";
import { WebSocketsUrl } from "@/config/constants";

export const wagmiConfig = getDefaultConfig({
  appName: "ERC20 Vault",
  projectId: "0c145e73f74608526249fa5c8ab223a0",
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: webSocket(WebSocketsUrl.Sepolia),
    [mainnet.id]: webSocket(WebSocketsUrl.Mainnet),
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
