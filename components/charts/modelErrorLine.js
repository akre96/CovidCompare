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
  CartesianGrid,
} from 'recharts';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import models from '../../assets/models';

function ModelErrorLine({ sqlData, name }) {
  const markerSize = [20, 20];
  var fill = '#7f8fa6';
  models.map((m) => {
    if (m.name === name) {
      fill = m.color;
    }
  });
  const truthData = sqlData.truth.map((t) => ({
    date: dayjs(t.date).valueOf() / 86400000,
    cases: t.truth,
  }));
  const modelData = sqlData.data.map((d) => {
    let error = null;
    if (d.truth) {
      error = d.mean - d.truth;
    }
    return {
      date: dayjs(d.date).valueOf() / 86400000,
      cases: d.mean,
      error: error,
    };
  });
  return (
    <>
      <strong>Predictions</strong>
      <ResponsiveContainer height={200}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="5 5" />
          <ZAxis range={markerSize} />
          <XAxis
            type="number"
            dataKey="date"
            tickFormatter={(v) => dayjs(Math.round(v * 86400000)).format('MMM DD')}
            domain={[truthData[0].date, modelData.slice(-1)[0].date]}
          />
          <YAxis dataKey="cases" />
          <Scatter data={modelData} fill={fill} fillOpacity={0.5} />
          <Scatter data={truthData} fill="#000000" />
        </ScatterChart>
      </ResponsiveContainer>
      <strong>Error</strong>
      <ResponsiveContainer height={200}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            type="number"
            dataKey="date"
            tickFormatter={(v) => dayjs(Math.round(v * 86400000)).format('MMM DD')}
            domain={[truthData[0].date, modelData.slice(-1)[0].date]}
          />
          <YAxis dataKey="error" />
          <ZAxis range={markerSize} />
          <Scatter data={modelData} fill={fill} fillOpacity={0.5} />
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
  name: PropTypes.string.isRequired,
};
ModelErrorLine.defaultProps = {
  sqlData: { data: [], truth: [] },
};

export default ModelErrorLine;
