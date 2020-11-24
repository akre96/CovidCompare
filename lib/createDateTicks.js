import dayjs from 'dayjs';

// Converts a date range in to a list for the first of each month
// Expects that each item in range is milliseconds since time start
export default function createDateTicks(range) {
  var first = dayjs(range[0]);
  const first_day = first.subtract(first.date() - 1, 'day');
  const months = Math.round((dayjs(range[1]) - first) / 86400000 / 30);
  const xTicks = [];
  for (let i = 0; i <= months; i++) {
    xTicks.push(first_day.add(i, 'month').valueOf());
  }
  return xTicks;
}
