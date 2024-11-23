"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import Button from "./Button";
import { MdAccountCircle } from "react-icons/md";

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
            <Button onClick={openAccountModal} className="gap-1">
              Account <MdAccountCircle />
            </Button>
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
