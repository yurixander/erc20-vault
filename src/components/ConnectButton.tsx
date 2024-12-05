import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { MdAccountCircle } from "react-icons/md";
import Button from "./Button";

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
        const connected =
          mounted && (chain !== undefined || account !== undefined);

        if (!connected) {
          return <Button onClick={openConnectModal}>Connect Wallet</Button>;
        }

        if (chain?.unsupported === true) {
          return <Button onClick={openChainModal}>Wrong network</Button>;
        }

        return (
          <Button onClick={openAccountModal} className="gap-1">
            Account <MdAccountCircle />
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
