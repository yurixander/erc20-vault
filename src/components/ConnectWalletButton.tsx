import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import Button from "./Button";
import { FiArrowRight } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

const ConnectWalletButton: FC = () => {
  return (
    <RainbowKitConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected =
          mounted && (chain !== undefined || account !== undefined);

        if (!connected) {
          return (
            <Button rightIcon={<FiArrowRight />} onClick={openConnectModal}>
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
            rightIcon={<FiArrowRight />}
            className="gap-1">
            <FaWallet />
            {account?.displayName ?? account?.address}
          </Button>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
};

export default ConnectWalletButton;
