import { useCallback } from "react";
import {
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  Abi as ViemAbi,
} from "viem";
import { ReadContractReturnType } from "wagmi/actions";
import { VIEM_PUBLIC_CLIENT } from "../config/constants";
import ensureError from "../utils/ensureError";

export type ContractReadOptions<
  Abi extends ViemAbi,
  FunctionName extends ContractFunctionName<Abi, "pure" | "view">,
> = {
  address: Address;
  functionName: FunctionName;
  args: ContractFunctionArgs<Abi, "pure" | "view", FunctionName>;
};

const useContractReadOnce = <Abi extends ViemAbi>(abi: Abi) => {
  const read = useCallback(
    async <FunctionName extends ContractFunctionName<Abi, "pure" | "view">>({
      address,
      functionName,
      args,
    }: ContractReadOptions<Abi, FunctionName>): Promise<
      | ReadContractReturnType<
          Abi,
          FunctionName,
          ContractFunctionArgs<Abi, "pure" | "view", FunctionName>
        >
      | Error
    > => {
      try {
        return await VIEM_PUBLIC_CLIENT.readContract({
          address,
          abi,
          functionName,
          args,
        });
      } catch (possibleError) {
        const error = ensureError(possibleError);

        console.error(
          `Error reading contract ${address} function ${functionName}:`,
          error,
        );

        return error;
      }
    },
    [abi],
  );

  return read;
};

export default useContractReadOnce;
