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
        mounted,
      }) => {
        const isLoading =
          mounted && (chain === undefined || account === undefined);

        if (!mounted) {
          return (
            <Button onClick={openConnectModal} isLoading={isLoading}>
              Connect Wallet
            </Button>
          );
        }

        if (chain?.unsupported === true) {
          return <Button onClick={openChainModal}>Wrong network</Button>;
        }

        return (
          <Button
            onClick={openAccountModal}
            className="gap-1"
            isLoading={isLoading}
          >
            Account <MdAccountCircle />
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
