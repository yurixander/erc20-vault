"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC, ReactNode } from "react";
import Button from "./Button";
import Image from "next/image";

const CustomConnectButton: FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const isLoading =
          authenticationStatus === "loading" &&
          (chain === undefined || account === undefined);

        const connected =
          mounted && !isLoading && chain !== undefined && account !== undefined;

        const accountElement = () => {
          if (!connected) {
            return (
              <Button onClick={openConnectModal} isLoading={isLoading}>
                Connect Wallet
              </Button>
            );
          }

          if (chain.unsupported === true) {
            return <Button onClick={openChainModal}>Wrong network</Button>;
          }

          return (
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={openChainModal}
                style={{ display: "flex", alignItems: "center" }}
                type="button"
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      overflow: "hidden",
                      marginRight: 4,
                    }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        style={{ width: 12, height: 12 }}
                      />
                    )}
                  </div>
                )}
                {chain.name}
              </button>

              <button onClick={openAccountModal} type="button">
                {account.displayName}
                {account.displayBalance ? ` (${account.displayBalance})` : ""}
              </button>
            </div>
          );
        };

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {accountElement()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
