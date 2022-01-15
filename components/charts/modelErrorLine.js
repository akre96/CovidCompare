/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
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

const defaultData = { data: [{ date: dayjs().valueOf() }], truth: [{ date: dayjs().valueOf() }] };

function ModelErrorLine({ sqlData, name, activeMonths }) {
  const markerSize = [20, 20];
  const today = dayjs().valueOf();
  let fill = '#7f8fa6';
  models
    .filter((m) => m.name === name)
    .forEach((m) => {
      fill = m.color;
    });
  const truthData = sqlData.truth.map((t) => ({
    date: dayjs(t.date).valueOf(),
    cases: t.truth,
  }));
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
        error,
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
  // eslint-disable-next-line react/prop-types
  function PredictionTooltip({ payload }) {
    if (!payload[0]) return null;
    return (
      <div className="scatterToolTip">
        <p className="date">{dayjs(payload[0].payload.date).format('MMM DD YYYY')}</p>
        {payload[0].payload.modelDate && (
          <p className="modelDate">
            Model Date: {dayjs(payload[0].payload.modelDate).format('MMM DD YYYY')}
          </p>
        )}
        <p>
          {mapNameToTitle[payload[1].name]}: {(payload[0].payload.cases / 1000).toFixed(1)}k
        </p>
      </div>
    );
  }
  function ErrorToolTip({ payload }) {
    if (!payload[0]) return null;
    return (
      <div className="scatterToolTip">
        <p className="date">{dayjs(payload[0].payload.date).format('MMM DD YYYY')}</p>
        {payload[0].payload.modelDate && (
          <p className="modelDate">
            Model Date: {dayjs(payload[0].payload.modelDate).format('MMM DD YYYY')}
          </p>
        )}
        <p>{`Error: ${(payload[0].payload.error / 1000).toFixed(2)}k deaths`}</p>
        <p>{`(Prediction: ${(payload[0].payload.cases / 1000).toFixed(2)}k, Recorded: ${(
          payload[0].payload.truth / 1000
        ).toFixed(2)}k)`}</p>
      </div>
    );
  }
  if (modelData.length < 1) {
    modelData.push(defaultData.data[0]);
  }
  const range = [dayjs('Jan 1 2020').valueOf(), dayjs().add(3, 'month').valueOf()];
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
            allowDataOverflow
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
            allowDataOverflow
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
  activeMonths: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      active: PropTypes.bool,
    }),
  ),
  name: PropTypes.string.isRequired,
};
ModelErrorLine.defaultProps = {
  sqlData: defaultData,
  activeMonths: createDateTicks([dayjs('2020-03-25').valueOf(), dayjs().valueOf()]).map((d) => ({
    value: d,
    active: true,
  })),
};

export default ModelErrorLine;
