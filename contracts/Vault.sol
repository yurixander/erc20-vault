// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract Vault {
    event DepositMade(
        uint256 depositId,
        address indexed account,
        address indexed tokenAddress,
        uint256 amount,
        uint256 startTimestamp,
        uint256 unlockTimestamp
    );

    event WithdrawalMade(
        uint256 depositId,
        address indexed account,
        address indexed tokenAddress,
        uint256 amount
    );

    error TransferFailed();
    error DepositAmountMustBeGreaterThanZero();
    error UnlockTimestampMustBeInTheFuture();
    error StartTimeMustBeBeforeUnlockTime();
    error DepositStillLocked();
    error InvalidDepositIndex();
    error InsufficientBalance();

    struct Deposit {
        uint256 depositId;
        address tokenAddress;
        uint256 priceInUsd;
        uint256 amount;
        uint256 startTimestamp;
        uint256 unlockTimestamp;
        bool withdrawn;
    }

    mapping(address => Deposit[]) public deposits;
    address[] public depositors;
    mapping(address => bool) private isDepositor;

    function deposit(
        address tokenAddress,
        uint256 priceInUsd,
        uint256 amount,
        uint256 unlockTimestamp
    ) public returns (uint256 depositIndex) {
        if (amount == 0) {
            revert DepositAmountMustBeGreaterThanZero();
        } else if (unlockTimestamp <= block.timestamp) {
            revert UnlockTimestampMustBeInTheFuture();
        }

        IERC20 token = IERC20(tokenAddress);
        uint256 userBalance = token.balanceOf(msg.sender);

        if (userBalance < amount) {
            revert InsufficientBalance();
        }

        bool success = token.transferFrom(msg.sender, address(this), amount);

        if (!success) {
            revert TransferFailed();
        }

        uint256 depositId = deposits[msg.sender].length;

        // On the initial deposit, this will still work even though the
        // inner array hasn't been explicitly initialized.
        deposits[msg.sender].push(
            Deposit(
                depositId,
                tokenAddress,
                priceInUsd,
                amount,
                block.timestamp,
                unlockTimestamp,
                false
            )
        );

        if (!isDepositor[msg.sender]) {
            isDepositor[msg.sender] = true;
            depositors.push(msg.sender);
        }

        emit DepositMade(
            depositId,
            msg.sender,
            tokenAddress,
            amount,
            block.timestamp,
            unlockTimestamp
        );

        return depositId;
    }

    function withdraw(address tokenAddress, uint256 depositId) public {
        if (depositId >= deposits[msg.sender].length) {
            revert InvalidDepositIndex();
        }

        Deposit storage userDeposit = deposits[msg.sender][depositId];

        // Check if the deposit is still locked.
        if (userDeposit.unlockTimestamp > block.timestamp) {
            revert DepositStillLocked();
        }

        uint256 amountToWithdraw = userDeposit.amount;

        // Mark deposit as withdrawn before making the transfer
        // to prevent re-entrancy attacks.
        userDeposit.amount = 0;
        userDeposit.withdrawn = true;

        IERC20 token = IERC20(tokenAddress);
        bool success = token.transfer(msg.sender, amountToWithdraw);

        if (!success) {
            revert TransferFailed();
        }

        emit WithdrawalMade(
            depositId,
            msg.sender,
            tokenAddress,
            amountToWithdraw
        );
    }

    function getDeposits(
        address account
    ) public view returns (Deposit[] memory) {
        if (deposits[account].length == 0) {
            return new Deposit[](0);
        }

        return deposits[account];
    }

    function getDepositors() public view returns (address[] memory) {
        return depositors;
    }
}
