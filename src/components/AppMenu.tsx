import { FC } from "react";
import { FaGithub } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { buttonVariants } from "./Button";

import { cn } from "@/lib/utils";
import CustomConnectButton from "./ConnectButton";

const AppMenu: FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-end gap-x-2 px-4">
      <div className="flex">
        <LinkButton
          className="gap-x-1.5"
          href="https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md"
        >
          Erc20 <IoIosPaper />
        </LinkButton>

        <LinkButton
          href="https://github.com/yurixander/erc20-vault"
          className="gap-x-1.5 "
        >
          Github <FaGithub />
        </LinkButton>
      </div>

      <CustomConnectButton />
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

export default AppMenu;
