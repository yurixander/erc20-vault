import { FC } from "react";
import { twMerge } from "tailwind-merge";
import ExternalLink from "../components/ExternalLink";

const Footer: FC<{ className?: string }> = ({ className }) => {
  return (
    <footer
      className={twMerge("flex items-center justify-center p-4", className)}
    >
      <p>
        <ExternalLink href="https://github.com/zeri-tech/erc20-vault">
          GitHub repository
        </ExternalLink>
      </p>
    </footer>
  );
};

export default Footer;
