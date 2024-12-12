import DisplayTvl from "@/components/DisplayTvl";
import { FC } from "react";

const DevPreview: FC = () => {
  return (
    <>
      <div className="p-10 bg-blue-600">
        <DisplayTvl />
      </div>
    </>
  );
};

export default DevPreview;
