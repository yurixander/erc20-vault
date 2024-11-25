import dayjs from "dayjs"

function generateDaysDiff(startTimestamp: number, endTimestamp: number): number {
  const startDate = dayjs(startTimestamp)
  const endDate = dayjs(endTimestamp)

  return endDate.diff(startDate, "days")
}

export function generateTimeRemaining(unlockTimestamp: number): string {
  const actualDate = dayjs(unlockTimestamp)

  const hoursDiff = actualDate.diff(Date.now(), "hours")

  if (hoursDiff >= 24) {
    const days = Math.floor(hoursDiff / 24)
    const hours = hoursDiff % 24

    return `${days}d ${hours}h`
  } else if (hoursDiff <= 0) {
    return "Ready to unlock"
  } else {
    return `${hoursDiff} hours`
  }
}

export function generateUnlockStatus(startTimestamp: number, unlockTimestamp: number): number {
  const totalDaysDiff = generateDaysDiff(startTimestamp, unlockTimestamp)
  const partDayDiff = generateDaysDiff(startTimestamp, Date.now())

  if (partDayDiff >= totalDaysDiff) {
    return 100
  }

  const percent = (partDayDiff * 100) / totalDaysDiff

  return Math.round(percent)
}
