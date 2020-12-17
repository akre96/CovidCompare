import dayjs from 'dayjs';

describe('Confirm dayJS behavior', () => {
  it('Creates expected output from test date', () => {
    const testDate = '2020-01-01';
    expect(dayjs(testDate).format('MMM DD YYYY')).toEqual('Jan 01 2020');
  });
});
