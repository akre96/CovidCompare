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
import rollingAverage from '../../lib/rollingAverage';
import caseRate from '../../lib/caseRate';

function ModelErrorLine({ sqlData }) {
  const truthData = sqlData.truth.map((t) => ({
    date: dayjs(t.date).valueOf(),
    cases: t.truth,
  }));
  const modelData = sqlData.data.map((d) => ({
    date: dayjs(d.date).valueOf(),
    cases: d.mean,
  }));
  const data = [...sqlData.data];
  return (
    <ResponsiveContainer height={200}>
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="date" tickFormatter={(v) => dayjs(v).format('MMM DD')} />
        <YAxis dataKey="cases" />
        <Scatter data={truthData} fill="#000000" />
        <Scatter data={modelData} fill="#e74c3c" />
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
