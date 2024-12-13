import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/Dialog/index";
import { Erc20TokenId } from "@/config/types";
import BN from "bn.js";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useState } from "react";
import ApprovalStep from "./ApprovalStep";
import DepositStep from "./DepositStep";

export type ApprovalData = {
  amount: BN;
  token: Erc20TokenId;
};

const DepositModal: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [approval, setApproval] = useState<ApprovalData | null>(null);
  const [step, setStep] = useState(0);

  const isApprovalStep = approval === null || step === 0;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="h-52 w-full"
            animate={{
              height: isApprovalStep ? "13rem" : "20rem",
            }}
          >
            <motion.div
              className="flex size-full flex-col"
              // Allows recomposition of animation.
              key={step}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                bounce: 0,
                duration: 0.1,
              }}
            >
              {isApprovalStep ? (
                <ApprovalStep
                  onNextStep={(data) => {
                    setApproval(data);
                    setStep(1);
                  }}
                />
              ) : (
                <DepositStep
                  {...approval}
                  onBack={() => setStep(0)}
                  onDeposit={() => {
                    // Clear data after deposit.
                    setApproval(null);
                    setStep(0);
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
