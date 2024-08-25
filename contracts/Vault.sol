// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract Vault {
  event DepositMade(
    address indexed account,
    address indexed tokenAddress,
    uint256 amount,
    uint256 unlockTimestamp
  );

  event WithdrawalMade(
    address indexed account,
    address indexed tokenAddress,
    uint256 amount
  );

  error TransferFailed();
  error DepositAmountMustBeGreaterThanZero();
  error UnlockTimestampMustBeInTheFuture();
  error DepositStillLocked();
  error InvalidDepositIndex();

  struct Deposit {
    address tokenAddress;
    uint256 amount;
    uint256 unlockTimestamp;
  }

  mapping(address => Deposit[]) public deposits;

  // TODO: Idea: Save what the price of the token was at the time of deposit, so that the frontend can show the profit or loss made through the time locked.
  function deposit(
    address tokenAddress,
    uint256 amount,
    uint256 unlockTimestamp
  ) public {
    if (amount == 0) {
      revert DepositAmountMustBeGreaterThanZero();
    } else if (unlockTimestamp <= block.timestamp) {
      revert UnlockTimestampMustBeInTheFuture();
    }

    IERC20 token = IERC20(tokenAddress);

    bool success = token.transferFrom(msg.sender, address(this), amount);

    if (!success) {
      revert TransferFailed();
    }

    // On the initial deposit, this will still work even though the
    // inner array hasn't been explicitly initialized.
    deposits[msg.sender].push(Deposit(tokenAddress, amount, unlockTimestamp));

    emit DepositMade(msg.sender, tokenAddress, amount, unlockTimestamp);
  }

  function withdraw(address tokenAddress, uint256 depositIndex) public {
    if (depositIndex >= deposits[msg.sender].length) {
      revert InvalidDepositIndex();
    }

    Deposit storage userDeposit = deposits[msg.sender][depositIndex];

    // Check if the deposit is still locked.
    if (userDeposit.unlockTimestamp > block.timestamp) {
      revert DepositStillLocked();
    }

    uint256 amountToWithdraw = userDeposit.amount;

    // Mark deposit as withdrawn before making the transfer
    // to prevent re-entrancy attacks.
    userDeposit.amount = 0;

    IERC20 token = IERC20(tokenAddress);
    bool success = token.transfer(msg.sender, amountToWithdraw);

    if (!success) {
      revert TransferFailed();
    }

    emit WithdrawalMade(msg.sender, tokenAddress, amountToWithdraw);
  }
}
