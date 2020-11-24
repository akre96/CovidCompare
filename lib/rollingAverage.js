// calculate an n day rolling average
export default function rollingAverage(data, n, names) {
  return data.map((d, i) => {
    let rd = { ...d };
    if (i < n) {
      names.map((m) => {
        rd[m] = null;
      });
    } else {
      names.map((m) => {
        if (d[m] != null) {
          let c = 0;
          let avg = 0;
          for (let j = i - n; j <= i; j++) {
            if (data[j][m] != null) {
              avg += data[j][m];
              c += 1;
            }
          }
          avg = avg / c;
          rd[m] = avg;
        }
      });
    }
    return rd;
  });
}
