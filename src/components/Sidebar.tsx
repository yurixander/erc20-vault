import { cn } from "@utils/utils";
import { FC } from "react";
import DisplayTvl from "./DisplayTvl";
import { FaGithub } from "react-icons/fa";
import { ExternalLinks } from "@utils/utils";
import ExternalLink from "./ExternalLink";

const AppSidebar: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <header className="flex h-16 w-full items-center justify-between px-4 sm:h-20 sm:border-b sm:border-b-blue-200/50 md:h-24 dark:sm:border-b-gray-200/50">
        <div className="size-12 rounded-full bg-blue-100" />
        <div className="h-8 w-24 rounded-md bg-blue-100" />
      </header>
      <div className="grow px-4 pt-4">
        <DisplayTvl />
      </div>
      <div className="mt-auto p-4">
        <ExternalLink
          href={ExternalLinks.GitHub}
          className="flex items-center justify-center gap-x-1.5"
        >
          <FaGithub />
          GitHub
        </ExternalLink>
      </div>
    </div>
  );
};

export default AppSidebar;
