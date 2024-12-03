import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC, useRef } from "react";
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
                className="flex max-w-xs items-center gap-x-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition hover:scale-105 focus-visible:scale-105 active:scale-100 dark:border-gray-800 dark:bg-gray-950"
                onKeyDown={({ key }) => handleKeyDown(key, "network")}
              >
                {chain.hasIcon && chain.iconUrl !== undefined && (
                  <picture className="-ml-1 flex size-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
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
              <div className="flex h-10 w-32 items-center gap-x-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="size-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />

                <div className="h-6 grow animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            )}

            {accountAlready && account.displayBalance !== undefined ? (
              <button
                ref={balanceRef}
                onClick={openAccountModal}
                className="flex max-w-xs items-center gap-x-4 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition-transform hover:scale-105 focus-visible:scale-105 active:scale-100 dark:border-gray-800 dark:bg-gray-950"
                onKeyDown={({ key }) => handleKeyDown(key, "balance")}
              >
                <Text className="w-max">{account.displayBalance}</Text>

                <Text
                  weight="medium"
                  className="w-max rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-900"
                >
                  {account.displayName}
                </Text>

                <ChevronDownIcon className="ml-auto size-5" />
              </button>
            ) : (
              <div className="flex h-10 w-64 items-center gap-x-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />

                <div className="h-6 grow animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default AccountDetail;
