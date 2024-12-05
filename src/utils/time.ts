import {
  differenceInSeconds,
  formatDistanceToNow,
  getUnixTime,
} from "date-fns";

export function generateTimeRemaining(unlockTimestamp: number): string {
  if (Date.now() >= unlockTimestamp) {
    return "Ready to unlock";
  }

  return formatDistanceToNow(unlockTimestamp);
}

export function generateUnlockStatus(
  startTimestamp: number,
  unlockTimestamp: number,
): number {
  const totalSecondsDiff = differenceInSeconds(unlockTimestamp, startTimestamp);

  const partSecondsDiff = differenceInSeconds(
    getUnixTime(Date.now()),
    startTimestamp,
  );

  if (partSecondsDiff >= totalSecondsDiff) {
    return 100;
  }

  const percent = (partSecondsDiff * 100) / totalSecondsDiff;

  return Math.trunc(percent * 100) / 100;
}
