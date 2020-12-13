// calculate an n day rolling average
export default function rollingAverage(data, days, names) {
  const n = days - 1
  return data.map((d, i) => {
    const rd = { ...d };
    names.forEach((m) => {
      if (d[m] != null) {
        let c = 0;
        let avg = 0;
        const max = i < n ? i : n;
        for (let j = i - max; j <= i; j++) {
          if (data[j][m] != null) {
            avg += data[j][m];
            c += 1;
          }
        }
        avg /= c;
        rd[m] = avg;
      }
    });
    return rd;
  });
}
