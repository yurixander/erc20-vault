import { Erc20TokenDefinition } from "@/config/types";
import { FC, useState } from "react";
import { getSymbolByTokenId } from "@/utils/tokens";
import { motion, Variants } from "framer-motion";

const avatarVariants: Variants = {
  visible: {
    display: "block",
    opacity: 1,
    scale: 1,
  },
  hidden: {
    display: "none",
    opacity: 0,
    scale: 0,
  },
};

const TokenAvatar: FC<{
  tokenDef: Erc20TokenDefinition;
}> = ({ tokenDef }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { iconAssetPath, name, tokenId } = tokenDef;

  return (
    <div className="flex size-8 items-center justify-center rounded-full bg-blue-50 [&>span]:text-blue-950">
      <motion.img
        variants={avatarVariants}
        className="size-full object-contain p-1"
        src={iconAssetPath}
        alt={`Icon for ${name}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(false)}
        initial={{ display: "none" }}
        animate={isLoaded ? "visible" : "hidden"}
      />

      <motion.span
        className="font-bold text-xs"
        key={`${isLoaded}`}
        initial={{ display: "none" }}
        transition={{ delay: 0.35 }}
        animate={{
          display: !isLoaded ? "block" : "none",
        }}
      >
        {getSymbolByTokenId(tokenId)}
      </motion.span>
    </div>
  );
};

export default TokenAvatar;
