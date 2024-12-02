import { FC, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Text } from "./Typography";

const NETWORK_ICON_SIZE = 24;

const AccountDetail: FC = () => {
  const networkRef = useRef<HTMLButtonElement | null>(null);
  const balanceRef = useRef<HTMLButtonElement | null>(null);

  const handleKeyDown = (key: string, place: "network" | "balance") => {
    if (place === "network" && key === "ArrowRight") {
      balanceRef.current?.focus();
    } else if (place === "balance" && key === "ArrowLeft") {
      networkRef.current?.focus();
    }
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, mounted }) => {
        const accountAlready = account !== undefined && mounted;
        const chainAlready = chain !== undefined && mounted;

        return (
          <div className="flex gap-x-4">
            {chainAlready && chain.name !== undefined ? (
              <button
                ref={networkRef}
                onClick={openChainModal}
                className="flex gap-x-2 dark:bg-gray-950 dark:border-gray-800 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition shadow-sm rounded-full py-1 px-2 items-center bg-white border border-gray-200"
                onKeyDown={({ key }) => handleKeyDown(key, "network")}
              >
                {chain.hasIcon && chain.iconUrl !== undefined && (
                  <picture className="bg-gray-100 dark:bg-gray-900 -ml-1 size-7 flex items-center justify-center rounded-full">
                    <img
                      src={chain.iconUrl}
                      alt={`Logo of ${chain.name}`}
                      height={NETWORK_ICON_SIZE}
                      width={NETWORK_ICON_SIZE}
                    />
                  </picture>
                )}

                {chain.name}

                <ChevronDownIcon className="size-5" />
              </button>
            ) : (
              <div className="h-10 w-32 bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-full flex gap-x-2 shadow-sm items-center px-2 py-1">
                <div className="size-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />

                <div className="h-6 grow animate-pulse bg-gray-200  dark:bg-gray-800 rounded-full" />
              </div>
            )}

            {accountAlready && account.displayBalance !== undefined ? (
              <button
                ref={balanceRef}
                onClick={openAccountModal}
                className="flex gap-x-4 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition-transform shadow-sm rounded-full py-1 px-2 items-center bg-white border border-gray-200 dark:bg-gray-950 dark:border-gray-800"
                onKeyDown={({ key }) => handleKeyDown(key, "balance")}
              >
                <Text className="w-max">{account.displayBalance}</Text>

                <Text
                  weight="medium"
                  className="bg-gray-100 dark:bg-gray-900 rounded-full px-2.5 py-1 w-max"
                >
                  {account.displayName}
                </Text>

                <ChevronDownIcon className="size-5 ml-auto" />
              </button>
            ) : (
              <div className="h-10 w-64 bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-full flex gap-x-2 shadow-sm items-center px-2 py-1">
                <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />

                <div className="h-6 grow animate-pulse bg-gray-200  dark:bg-gray-800 rounded-full" />
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default AccountDetail;
