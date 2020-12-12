import dayjs from 'dayjs';

// Converts a date range in to a list for the first of each month
// Expects that each item in range is milliseconds since time start
export default function createDateTicks(range) {
  const first = dayjs(range[0]);
  const firstDay = first.subtract(first.date() - 1, 'day');
  const months = Math.round((dayjs(range[1]) - first) / 86400000 / 30);
  const xTicks = [];
  for (let i = 1; i <= months; i++) {
    xTicks.push(firstDay.add(i, 'month').valueOf());
  }
  return xTicks;
}
