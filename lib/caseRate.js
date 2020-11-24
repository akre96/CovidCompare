// Calculate daily case rate
export default function caseRate(data, names) {
  return data.map((d, i) => {
    let rd = { ...d };

    // first data point set to null
    if (i === 0) {
      names.map((m) => {
        if (!(typeof rd[m] === 'undefined')) {
          rd[m] = null;
        }
      });
    } else {
      // if consecutive not-null points get case difference
      names.map((m) => {
        if ((d[m] != null) & (data[i - 1][m] != null)) {
          rd[m] = d[m] - data[i - 1][m];
        } else {
          rd[m] = null;
        }
      });
    }
    return rd;
  });
}
