import { FC } from "react";
import { FaGithub } from "react-icons/fa";
import { buttonVariants } from "./Button";
import { cn } from "@utils/utils";
import ConnectWalletButton from "./ConnectWalletButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Heading } from "./Typography";
import { CommonLink } from "@utils/utils";

const NETWORK_ICON_SIZE = 24;

const Navbar: FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-between gap-2 px-4">
      {/** Left side */}
      <Heading>ERC-20 Vault</Heading>

      {/** Right side */}
      <div className="flex items-center justify-between gap-2">
        <div className="block md:hidden">
          <LinkButton href={CommonLink.GitHub} className="gap-x-1.5">
            <FaGithub />
            GitHub
          </LinkButton>
        </div>

        <ConnectButton.Custom>
          {({ chain, openChainModal, mounted }) => {
            const isChainReady = chain !== undefined && mounted;

            return (
              <div className="flex gap-x-4">
                {isChainReady && chain.name !== undefined && (
                  <button
                    onClick={openChainModal}
                    className="flex max-w-xs items-center gap-x-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition hover:scale-105 focus-visible:scale-105 active:scale-100 dark:border-gray-800 dark:bg-gray-950"
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
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>

        <ConnectWalletButton />
      </div>
    </div>
  );
};

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const LinkButton: FC<LinkButtonProps> = ({ className, href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        "select-none ",
        className,
        buttonVariants({ variant: "ghost" }),
      )}
    >
      {children}
    </a>
  );
};

export default Navbar;
