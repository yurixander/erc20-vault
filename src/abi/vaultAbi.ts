import { Abi } from "viem";

const VAULT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "priceInUsd", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
    ],
    name: "deposit",
    outputs: [
      { internalType: "uint256", name: "depositIndex", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "DepositAlreadyWithdrawn", type: "error" },
  { inputs: [], name: "DepositAmountMustBeGreaterThanZero", type: "error" },
  { inputs: [], name: "DepositStillLocked", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InvalidDepositIndex", type: "error" },
  { inputs: [], name: "StartTimeMustBeBeforeUnlockTime", type: "error" },
  { inputs: [], name: "TokenAddressMismatch", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  { inputs: [], name: "Unauthorized", type: "error" },
  { inputs: [], name: "UnlockTimestampMustBeInTheFuture", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockTimestamp",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "depositId", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawalMade",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "depositIds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "deposits",
    outputs: [
      { internalType: "uint256", name: "depositId", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "priceInUsd", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "startTimestamp", type: "uint256" },
      { internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
      { internalType: "bool", name: "withdrawn", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDeposits",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "depositId", type: "uint256" },
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "priceInUsd", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "startTimestamp", type: "uint256" },
          { internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
          { internalType: "bool", name: "withdrawn", type: "bool" },
        ],
        internalType: "struct Vault.Deposit[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getDeposits",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "depositId", type: "uint256" },
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "priceInUsd", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "startTimestamp", type: "uint256" },
          { internalType: "uint256", name: "unlockTimestamp", type: "uint256" },
          { internalType: "bool", name: "withdrawn", type: "bool" },
        ],
        internalType: "struct Vault.Deposit[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const satisfies Abi;

export default VAULT_ABI;
