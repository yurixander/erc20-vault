import Button from "@/components/Button";
import DepositModal from "@/components/DepositModal/DepositModal";
import { FC, useEffect } from "react";

const DevPreview: FC = () => {
  useEffect(() => {
    document.querySelector("html")?.classList.add("dark");
  }, []);

  return (
    <>
      <div className="m-8 flex flex-col gap-4">
        <DepositModal>
          <Button>Create a new deposit</Button>
        </DepositModal>
      </div>
    </>
  );
};

export default DevPreview;
