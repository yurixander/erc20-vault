import { FC } from "react";
import ExternalLink from "./ExternalLink";
import { Text } from "./Typography";

export type LegendProps = {
  children: string;
  linkText?: string;
  linkHref?: string;
};

const Legend: FC<LegendProps> = ({
  children,
  linkText = "Learn more",
  linkHref,
}) => {
  return (
    <Text size="1" className="pl-1">
      <Text size="1" className="opacity-40">
        {children}
      </Text>{" "}
      {linkHref !== undefined && (
        <ExternalLink
          hideIcon
          className="text-xs text-blue-400 font-medium"
          href={linkHref}
        >
          {linkText}
        </ExternalLink>
      )}
    </Text>
  );
};

export default Legend;
