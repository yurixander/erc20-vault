import { FC } from "react";
import ExternalLink from "../components/ExternalLink";
import { twMerge } from "tailwind-merge";

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
