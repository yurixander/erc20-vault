import { Erc20TokenId, ERC20TokenPrices } from "@/config/types";
import useTokenPrice from "@/hooks/useTokenPrice";
import { FC, useEffect, useState } from "react";

const DevPreview: FC = () => {
  const [prices, setPrices] = useState<ERC20TokenPrices | null>(null);

  const { getAllPrices } = useTokenPrice(
    Object.values(Erc20TokenId).filter((e) => e !== Erc20TokenId.MTK),
  );

  useEffect(() => {
    if (getAllPrices === null) {
      return;
    }

    getAllPrices().then(setPrices);
  }, [getAllPrices]);

  return (
    <>
      {prices === null ? (
        <span>Null Prices</span>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(prices).map((price) => (
            <span key={price[0]}>
              {price[0]}: {price[1]}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default DevPreview;
