/**
 * @file Component used to show linechart of prediction errors over time
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import models from '../../assets/models';

function ModelErrorLine({ sqlData }) {
  const truthData = sqlData.truth.map((t) => ({
    date: dayjs(t.date).valueOf() / 86400000,
    cases: t.truth,
  }));
  const modelData = sqlData.data.map((d) => ({
    date: dayjs(d.date).valueOf() / 86400000,
    cases: d.mean,
  }));
  const data = [...sqlData.data];
  return (
    <ResponsiveContainer height={200}>
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis
          type="number"
          dataKey="date"
          tickFormatter={(v) => dayjs(Math.round(v * 86400000)).format('MMM DD')}
          domain={[truthData[0].date, modelData.slice(-1)[0].date ]}
        />
        <YAxis dataKey="cases" />
        <Scatter data={modelData} fill="#e74c3c" />
        <Scatter data={truthData} fill="#000000" />
        <Tooltip />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

ModelErrorLine.propTypes = {
  sqlData: PropTypes.shape({
    data: PropTypes.array,
    truth: PropTypes.array,
  }),
};
ModelErrorLine.defaultProps = {
  sqlData: { data: [], truth: [] },
};

export default ModelErrorLine;
