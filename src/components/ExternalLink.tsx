import { FC, ReactNode } from "react";
import { FiExternalLink } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  hideIcon?: boolean;
  className?: string;
};

const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  children,
  className,
  hideIcon = false,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      className={twMerge(
        "inline-flex items-center justify-center gap-1 hover:underline",
        className,
      )}
    >
      {children} {!hideIcon && <FiExternalLink />}
    </a>
  );
};

export default ExternalLink;
