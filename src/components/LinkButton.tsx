import { FC } from "react";
import { cn } from "@utils/utils";
import { buttonVariants } from "./Button";

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
        "select-none",
        className,
        buttonVariants({ variant: "outline" }),
      )}
    >
      {children}
    </a>
  );
};

export default LinkButton;
