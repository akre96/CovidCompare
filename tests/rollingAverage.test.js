import rollingAverage from '../lib/rollingAverage';

const testData = [
  { date: '2020-01-01', testModel: 1 },
  { date: '2020-01-02', testModel: 2 },
  { date: '2020-01-03', testModel: 3 },
  { date: '2020-01-04', testModel: 4 },
  { date: '2020-01-05', testModel: 5 },
];

describe('Rolling Average', () => {
  it('Returns original on 1 day rolling', () => {
    const res = rollingAverage(testData, 1, ['testModel']);
    expect(res).toEqual(testData);
  });
  it('Returns correct 2 day rolling', () => {
    const res = rollingAverage(testData, 2, ['testModel']);
    const expRes = [
      { date: '2020-01-01', testModel: 1 },
      { date: '2020-01-02', testModel: 1.5 },
      { date: '2020-01-03', testModel: 2.5 },
      { date: '2020-01-04', testModel: 3.5 },
      { date: '2020-01-05', testModel: 4.5 },
    ];
    expect(res).toEqual(expRes);
  });
});
