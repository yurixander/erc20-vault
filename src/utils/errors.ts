import { BaseError, ContractFunctionExecutionError } from "viem";

export function ensureError(possibleError: unknown): Error {
  if (possibleError instanceof BaseError) {
    return new Error(possibleError.shortMessage);
  } else if (typeof possibleError === "string") {
    return new Error(possibleError);
  } else if (possibleError instanceof Error) {
    return possibleError;
  }

  return new Error(
    `Unknown error because the thrown value was not an Error or string (type was ${typeof possibleError})`,
  );
}

export function debugVaultContractError(error: any): Error {
  console.error(`vault contract error: ${error}`);

  if (
    error instanceof ContractFunctionExecutionError &&
    error.shortMessage === "An unknown RPC error occurred."
  ) {
    return new Error("Failed connect to RPC, check your connection.");
  }

  return new Error("An unexpected error occurred");
}
