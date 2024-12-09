import { FC } from "react";
import {
  IoIosHelpBuoy,
  IoIosStar,
  IoIosWallet,
  IoLogoGithub,
} from "react-icons/io";
import { Heading, Text } from "./Typography";
import { IconType } from "react-icons/lib";
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";

const WelcomeSplash: FC = () => {
  return (
    <div className="flex flex-col gap-4 size-full">
      <div className="flex justify-center">
        <IoIosStar className="text-blue-600" size={100} />
      </div>
      <div>
        <Heading className="flex justify-center">
          Welcome to ERC20 - Vault
        </Heading>
        <Text className="flex justify-center">
          Connect your wallet to get starter
        </Text>
      </div>
      <div className="flex gap-4 w-full p-4 items-center justify-center">
        <CustomConnectButton />
        <CardButton
          onClick={() => {
            open("https://github.com/yurixander/erc20-vault");
          }}
          Icon={IoLogoGithub}
          label="GitHub"
        />
        {/**TODO: Create and implement Help page */}
        <CardButton onClick={() => {}} Icon={IoIosHelpBuoy} label="Help" />
      </div>
    </div>
  );
};

export default WelcomeSplash;

const CardButton: FC<{
  Icon: IconType;
  label: string;
  onClick: () => void;
}> = ({ Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col bg-blue-600 border shadow size-40 rounded-lg items-center justify-center hover:scale-105"
    >
      <div>
        <Icon size={48} className="text-white" />
      </div>
      <Text size="5" className="flex justify-center text-center text-white">
        {label}
      </Text>
    </button>
  );
};

const CustomConnectButton: FC = () => {
  return (
    <RainbowKitConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected =
          mounted && (chain !== undefined || account !== undefined);

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="flex flex-col bg-blue-600 border shadow size-40 rounded-lg items-center justify-center hover:scale-105"
            >
              <div>
                <IoIosWallet size={48} className="text-white" />
              </div>
              <Text
                size="5"
                className="flex justify-center text-center text-white"
              >
                Connect You Wallet
              </Text>
            </button>
          );
        }
      }}
    </RainbowKitConnectButton.Custom>
  );
};
