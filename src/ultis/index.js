export function arrFromRangeGenerate(from, to, numberIncreate = 1) {
  let result = [];
  while (from <= to) {
    result.push(from);
    let next = from + numberIncreate;
    if (from < to && next > to) {
      result.push(to);
    }
    from = next;
  }
  return result;
}

export function getQuarterFromMonth(month, isNotMonthIndex = false) {
  if (!isNotMonthIndex) {
    month += 1;
  }
  if ([1, 2, 3].includes(month)) {
    return 0;
  }
  if ([4, 5, 6].includes(month)) {
    return 1;
  }
  if ([7, 8, 9].includes(month)) {
    return 2;
  }
  if ([10, 11, 12].includes(month)) {
    return 3;
  }
  return 4;
}

export function getDateRangeByTimeFrame(timeFrame) {
  const currentDate = new Date();
  let fromDate = new Date();
  if (timeFrame === "all") return [-Infinity, +Infinity];
  if (timeFrame === "ytd")
    fromDate = new Date(Date.UTC(currentDate.getUTCFullYear()));
  const [value, type] = timeFrame.split("");
  switch (type) {
    case "d":
      fromDate.setUTCDate(currentDate.getUTCDate() - value);
      break;
    case "m":
      fromDate.setUTCMonth(currentDate.getUTCMonth() - value);
      break;
    case "y":
      fromDate.setUTCFullYear(currentDate.getUTCFullYear() - value);
      break;
  }
  return [fromDate.getTime(), currentDate.getTime()];
}

export * from "./number";
