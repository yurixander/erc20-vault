import { differenceInSeconds, formatDistanceToNow } from "date-fns";

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
  const startTimestampInMilliseconds = startTimestamp * 1000;
  const unlockTimestampInMilliseconds = unlockTimestamp * 1000;

  const totalSecondsDiff = differenceInSeconds(
    unlockTimestampInMilliseconds,
    startTimestampInMilliseconds,
  );

  const partSecondsDiff = differenceInSeconds(
    Date.now(),
    startTimestampInMilliseconds,
  );

  if (partSecondsDiff >= totalSecondsDiff) {
    return 100;
  }

  const percent = (partSecondsDiff * 100) / totalSecondsDiff;

  return Math.trunc(percent * 100) / 100;
}

export function lessThanOfInSeconds(
  earlyTimestamp: number,
  seconds: number,
): boolean {
  return differenceInSeconds(Date.now(), earlyTimestamp) <= seconds;
}
