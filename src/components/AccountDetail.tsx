"use client";

import { FC, useRef } from "react";
import Image from "next/image";

type AccountDetailProps = {
  accountName: string;
  networkName: string;
  accountBalance: string;
  networkIconUrl?: string;
  onNetworkClick: () => void;
  onBalanceClick: () => void;
};

const NETWORK_ICON_SIZE = 24;

const AccountDetail: FC<AccountDetailProps> = ({
  accountBalance,
  accountName,
  networkName,
  networkIconUrl,
  onBalanceClick,
  onNetworkClick,
}) => {
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
    <div className="flex gap-x-4">
      <button
        ref={networkRef}
        onClick={onNetworkClick}
        className="flex gap-x-2 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition-transform  shadow-sm  rounded-full py-1 px-4 items-center bg-white border border-gray-200"
        onKeyDown={({ key }) => handleKeyDown(key, "network")}
      >
        {networkIconUrl !== undefined && (
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
      </button>

      <button
        ref={balanceRef}
        onClick={onBalanceClick}
        className="flex gap-x-4 max-w-xs focus-visible:scale-105 active:scale-100 hover:scale-105 transition-transform  shadow-sm  rounded-full py-1 px-2 items-center bg-white border border-gray-200"
        onKeyDown={({ key }) => handleKeyDown(key, "balance")}
      >
        <span>{accountBalance}</span>

        <span className="bg-gray-100 rounded-full px-2.5 font-medium py-1">
          {accountName}
        </span>
      </button>
    </div>
  );
};

export default AccountDetail;
