import useTokenPrice from "@/hooks/useTokenPrice";
import { FC, useEffect } from "react";

const DevPreview: FC = () => {
  const { getAllPrices } = useTokenPrice();

  useEffect(() => {
    console.log(getAllPrices?.());
  }, [getAllPrices]);

  return <></>;
};

export default DevPreview;
