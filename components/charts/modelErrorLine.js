/**
 * @file Component used to show linechart of prediction errors over time
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import models from '../../assets/models';
import createDateTicks from '../../lib/createDateTicks';

function ModelErrorLine({ sqlData, name, activeMonths }) {
  const markerSize = [20, 20];
  const today = dayjs().valueOf();
  var fill = '#7f8fa6';
  models.map((m) => {
    if (m.name === name) {
      fill = m.color;
    }
  });
  const truthData = sqlData.truth.map((t) => ({
    date: dayjs(t.date).valueOf(),
    cases: t.truth,
  }));
  console.log(activeMonths)
  console.log(activeMonths.map((m) => dayjs(m).format('MMM DD YYYY')))
  const modelData = sqlData.data
    .filter((d) =>
      activeMonths.some(
        (m) =>
          dayjs(d.model_date).isAfter(dayjs(m.value).subtract(1, 'day')) &&
          dayjs(d.model_date).isBefore(dayjs(m.value).add(1, 'month')),
      ),
    )
    .map((d) => {
      let error = null;
      if (d.truth) {
        error = d.mean - d.truth;
      }
      return {
        date: dayjs(d.date).valueOf(),
        modelDate: d.model_date,
        cases: d.mean,
        error: error,
        truth: d.truth,
      };
    });
  function yTickFormatter(v) {
    if (v === 0) return v;
    return `${(v / 1000).toFixed(1)}k`;
  }
  const mapNameToTitle = {
    cases: 'Predicted Deaths',
    error: 'Error',
  };
  function PredictionTooltip({ payload }) {
    if (!payload[0]) return;
    return (
      <div className="scatterToolTip">
        <p className="date">{dayjs(payload[0].payload.date).format('MMM DD YYYY')}</p>
        {payload[0].payload.modelDate && (
          <p className="modelDate">
            Model Date: {dayjs(payload[0].payload.modelDate).format('MMM DD YYYY')}
          </p>
        )}
        <p>
          {mapNameToTitle[payload[1].name]}: {(payload[0].payload.cases/1000).toFixed(1)}k
        </p>
      </div>
    );
  }
  function ErrorToolTip({ payload }) {
    if (!payload[0]) return;
    return (
      <div className="scatterToolTip">
        <p className="date">{dayjs(payload[0].payload.date).format('MMM DD YYYY')}</p>
        {payload[0].payload.modelDate && (
          <p className="modelDate">
            Model Date: {dayjs(payload[0].payload.modelDate).format('MMM DD YYYY')}
          </p>
        )}
        <p>{`Error: ${(payload[0].payload.error/1000).toFixed(1)}k deaths`}</p>
        <p>{`(Prediction: ${(payload[0].payload.cases/1000).toFixed(1)}k, Recorded: ${(payload[0].payload.truth/1000).toFixed(1)}k)`}</p>
      </div>
    );
  }
  const range = [truthData[0].date, modelData.slice(-1)[0].date];
  return (
    <>
      <strong>Prediction (Cumulative Deaths)</strong>
      <ResponsiveContainer height={200}>
        <ScatterChart syncId="allPred">
          <CartesianGrid strokeDasharray="5 5" />
          <ZAxis range={markerSize} />
          <XAxis
            type="number"
            dataKey="date"
            tickFormatter={(v) => dayjs(v).format('MMM DD')}
            domain={range}
            ticks={createDateTicks(range)}
          />
          <YAxis dataKey="cases" tickFormatter={yTickFormatter} />
          <ReferenceLine x={today} stroke="black" strokeWidth={2} />
          <Scatter data={truthData} fill="#000000" />
          <Scatter data={modelData} fill={fill} fillOpacity={0.5} />
          <Tooltip content={PredictionTooltip} />
        </ScatterChart>
      </ResponsiveContainer>
      <strong>Error (Deaths)</strong>
      <ResponsiveContainer height={200}>
        <ScatterChart syncId="allPred">
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            type="number"
            dataKey="date"
            tickFormatter={(v) => dayjs(v).format('MMM DD')}
            domain={range}
            ticks={createDateTicks(range)}
          />
          <YAxis dataKey="error" tickFormatter={yTickFormatter} />
          <ZAxis range={markerSize} />
          <Scatter data={modelData} fill={fill} fillOpacity={0.5} />
          <ReferenceLine x={today} stroke="black" strokeWidth={2} />
          <ReferenceLine y={0} strokeOpacity={0.5} stroke="gray" strokeWidth={2} />
          <Tooltip content={ErrorToolTip} />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}

ModelErrorLine.propTypes = {
  sqlData: PropTypes.shape({
    data: PropTypes.array,
    truth: PropTypes.array,
  }),
  activeMonths: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string.isRequired,
};
ModelErrorLine.defaultProps = {
  sqlData: { data: [{ date: dayjs().valueOf() }], truth: [{ date: dayjs().valueOf() }] },
  activeMonths: createDateTicks([dayjs('2020-03-25').valueOf(), dayjs().valueOf()]),
};

export default ModelErrorLine;
