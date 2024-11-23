"use client";

import { FC, useRef } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@radix-ui/react-icons";

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
        const connected =
          mounted && chain !== undefined && account !== undefined;

        const networkIconUrl = chain?.iconUrl;
        const networkName = chain?.name;

        if (!connected) {
          return "Connect your wallet to get started.";
        }

        return (
          <div className="flex gap-x-4">
            <button
              ref={networkRef}
              onClick={openChainModal}
              className="flex gap-x-2 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition  shadow-sm  rounded-full py-1 px-2 items-center bg-white border border-gray-200"
              onKeyDown={({ key }) => handleKeyDown(key, "network")}
            >
              {networkIconUrl !== undefined && networkName !== undefined && (
                <picture className="bg-gray-100 -ml-1 size-7 flex items-center justify-center rounded-full">
                  <Image
                    src={networkIconUrl}
                    alt={`Logo of ${networkName}`}
                    height={NETWORK_ICON_SIZE}
                    width={NETWORK_ICON_SIZE}
                  />
                </picture>
              )}
              {networkName}
              <ChevronDownIcon className="size-5" />
            </button>

            <button
              ref={balanceRef}
              onClick={openAccountModal}
              className="flex gap-x-4 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition-transform  shadow-sm  rounded-full py-1 px-2 items-center bg-white border border-gray-200"
              onKeyDown={({ key }) => handleKeyDown(key, "balance")}
            >
              <span>{account.displayBalance}</span>

              <span className="bg-gray-100 rounded-full px-2.5 font-medium py-1">
                {account.displayName}
              </span>

              <ChevronDownIcon className="size-5" />
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default AccountDetail;
