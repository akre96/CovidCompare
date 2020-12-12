/**
 * @file Component used to show linechart of COVID deaths and deaths per day
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';
import {
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
  XAxis,
  Text,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import models from '../../assets/models';
import createDateTicks from '../../lib/createDateTicks';

// Get updated models only
const currentModels = models
  .filter((m) => m.current)
  // corrects for sql error caused by dashes in model names
  .map((m) => ({ ...m, active: true, name: m.name.replace(/-/g, '_') }));

/** 
 * Chart to compare models
 * @summary Compare different predictive models either cumulative deaths or per day as a line chart with errors if available. 
 Applies 7 day rolling average to data. Expects data in format from api at /api/[regions].js .
 * @param {number} height - height of component in pixels
 * @param {object} data - data from /api/[region].js api call
 * @param {bool} showRate - toggles showing deaths/day or cumulative deaths
 */
function CompareModelsLine({ height, sqlData, showRate, showCI, zoom }) {
  // React Hook for which models to display
  const [activeModels, setModels] = useState(currentModels);

  // today used to draw reference line
  const todayObj = dayjs();
  const today = todayObj.valueOf();

  // just names of models
  const modelNames = currentModels.map((m) => m.name);

  // Delete model predictions before today, fill null days

  sqlData.truth.forEach((d) => {
    d.date = dayjs(d.date).valueOf();
  });
  sqlData.data.forEach((d) => {
    d.date = dayjs(d.date).valueOf();
    // Format prediction bounds for ReCharts
    modelNames.forEach((m) => {
      d[`${m}_range`] = [d[`${m}_l`], d[`${m}_u`]];
    });
  });

  const data = sqlData.data.filter((d) => {
    return todayObj.isBefore(d.date);
  });
  const allData = [...sqlData.truth, ...data];

  // Checkboxes to plot/hide model predictions
  const ModelCheckboxes = activeModels.map((m, i) => (
    <div key={m.name} className="form-check form-check-inline">
      <input
        type="checkbox"
        checked={m.active}
        className="form-check-input"
        id={m.name}
        value={i}
        onChange={(e) => {
          const tempModels = [...activeModels];
          tempModels[e.target.value] = {
            ...activeModels[e.target.value],
            active: !activeModels[e.target.value].active,
          };
          setModels(tempModels);
        }}
      />
      <label className="form-check-label" htmlFor={m.name}>
        <strong style={{ color: m.color }}>{m.name.replace(/_/g, '-')}</strong>
        <a href={m.link} rel="noreferrer" target="_blank">
          <BsBoxArrowRight style={{ marginLeft: '5px' }} />
        </a>
      </label>
    </div>
  ));

  // models to plot
  const modelLines = activeModels
    .filter((m) => m.active)
    .map((m) => {
      return <Line key={m.name} type="monotone" dataKey={m.name} stroke={m.color} dot={false} />;
    });
  // lower/upper bounds of models
  const modelErrors = activeModels
    .filter((m) => m.active)
    .map((m) => {
      return (
        <Area
          key={`${m.name}_range`}
          legendType="none"
          type="monotone"
          dataKey={`${m.name}_range`}
          stroke={m.color}
          fill={m.color}
          data={data}
          fillOpacity={0.5}
        />
      );
    });

  // Hides tooltip for lower/upper bounds
  function tooltipFormatter(v, n, p) {
    try {
      v.toFixed(2);
      if (n === 'Recorded Deaths') return `${(v / 1000).toFixed(2)}k`;
      if (p.payload[`${p.name}_range`][0] !== null) {
        return `${(v / 1000).toFixed(2)}k (95% CI ${(
          p.payload[`${p.name}_range`][0] / 1000
        ).toFixed(2)}k - ${(p.payload[`${p.name}_range`][1] / 1000).toFixed(2)}k)`;
      }
      // just checks that number and not range
      return `${(v / 1000).toFixed(2)}k`;
    } catch {
      return [null, null];
    }
  }
  function labelFormatter(l) {
    const date = dayjs(l);
    if (date.isBefore(today)) {
      return date.format('MMM DD YYYY');
    }
    const nweeks = ((date - today) / 86400000 / 7).toFixed(1);
    return `${date.format('MMM DD YYYY')} - ${nweeks} weeks ahead`;
  }
  function yTickFormatter(v) {
    if (v === 0) return v;
    if (v > 100000) {
      return `${(v / 1000).toFixed(0)}k`;
    }
    if (v > 10000) {
      return `${(v / 1000).toFixed(1)}k`;
    }
    return `${(v / 1000).toFixed(2)}k`;
  }
  let range = [allData[0].date, allData[allData.length - 1].date];
  if (zoom) {
    range = [dayjs().subtract(3, 'month').valueOf(), range[1]];
  }
  return (
    <>
      <div className="row">
        <div className="col-md-10">
          <ResponsiveContainer height={height}>
            <ComposedChart data={allData}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis
                allowDataOverflow
                domain={range}
                type="number"
                dataKey="date"
                ticks={createDateTicks(range)}
                tickFormatter={(v) => dayjs(v).format('MMM DD')}
              />
              <YAxis
                type="number"
                label={
                  <Text x={0} y={0} dx={15} dy={250} offset={0} angle={-90}>
                    {showRate ? 'Deaths Per Day' : 'Cumulative Deaths'}
                  </Text>
                }
                tickFormatter={yTickFormatter}
              />
              {showCI && modelErrors}
              <Line
                name="Recorded Deaths"
                type="monotone"
                dataKey="truth"
                stroke="black"
                dot={false}
                strokeWidth={2}
              />
              {modelLines}
              <ReferenceLine x={today} stroke="black" strokeWidth={2} />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={labelFormatter}
                labelStyle={{ fontWeight: 'bold' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-2">
          <div className="form-group" style={{ textAlign: 'left' }}>
            <h5>Modeling Group</h5>
            {ModelCheckboxes}
          </div>
        </div>
      </div>
    </>
  );
}

CompareModelsLine.propTypes = {
  height: PropTypes.number,
  sqlData: PropTypes.shape({
    data: PropTypes.array,
    truth: PropTypes.array,
  }),
  showRate: PropTypes.bool.isRequired,
  showCI: PropTypes.bool.isRequired,
  zoom: PropTypes.bool.isRequired,
};
CompareModelsLine.defaultProps = {
  height: 500,
  sqlData: { data: [{ date: dayjs.valueOf() }], truth: [{ date: dayjs().valueOf() }] },
};

export default CompareModelsLine;
