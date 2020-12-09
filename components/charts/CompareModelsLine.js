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
import rollingAverage from '../../lib/rollingAverage';
import caseRate from '../../lib/caseRate';
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
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
function CompareModelsLine({ height, sqlData, showRate, errors, showCI, zoom }) {
  // React Hook for which models to display
  const [activeModels, setModels] = useState(currentModels);

  if (errors) return 'Error encountered';
  // today used to draw reference line
  const todayObj = dayjs();
  const today = todayObj.valueOf();

  // just names of models
  const model_names = currentModels.map((m) => m.name);

  // models and ground truth
  const base_names = [...model_names, 'truth'];

  // Delete model predictions before today, fill null days

  sqlData.truth.map((d) => {
    d.date = dayjs(d.date).valueOf();
  });
  sqlData.data.map((d) => {
    d.date = dayjs(d.date).valueOf();
    // Format prediction bounds for ReCharts
    model_names.map((m) => {
      d[`${m}_range`] = [d[`${m}_l`], d[`${m}_u`]];
    });
  });

  const data = sqlData.data.filter((d) => {
    return todayObj.isBefore(d.date);
  });
  const allData = [...sqlData.truth, ...data];

  // Rolling average run on daily case rate. Lower and upper bounds not used for rate
  const rate_data = rollingAverage(
    caseRate(allData, base_names),
    7, // seven days
    base_names,
  );

  // Checkboxes to plot/hide model predictions
  const ModelCheckboxes = activeModels.map((m, i) => (
    <div key={i} className="form-check form-check-inline">
      <input
        type="checkbox"
        checked={m.active}
        className="form-check-input"
        id={m.name}
        value={i}
        onChange={(e) => {
          let tempModels = [...activeModels];
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
  const model_lines = activeModels.map((m) => {
    if (!m.active) {
      return;
    }
    return <Line key={m.name} type="monotone" dataKey={m.name} stroke={m.color} dot={false} />;
  });
  // lower/upper bounds of models
  const model_errors = activeModels.map((m) => {
    if (!m.active) {
      return;
    }
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

  const AxisLabel = ({ axisType, x, y, width, height, stroke, children }) => {
    const isVert = axisType === 'yAxis';
    const cx = isVert ? x : x + width / 2;
    const cy = isVert ? height / 2 + y : y + height + 10;
    const rot = isVert ? `270 ${cx} ${cy}` : 0;
    return (
      <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
        {children}
      </text>
    );
  };
  // Hides tooltip for lower/upper bounds
  function tooltipFormatter(v, n, p) {
    try {
      v.toFixed(2);
      if (n === 'Recorded Deaths') return `${(v / 1000).toFixed(2)}k`;
      if (p.payload[p.name + '_range'][0] !== null && !showRate) {
        return `${(v / 1000).toFixed(2)}k (95% CI ${(
          p.payload[p.name + '_range'][0] / 1000
        ).toFixed(2)}k - ${(p.payload[p.name + '_range'][1] / 1000).toFixed(2)}k)`;
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
  let range = [allData[0].date, allData.splice(-1)[0].date];
  if (zoom) {
    range = [dayjs().subtract(3, 'month').valueOf(), range[1]];
  }
  return (
    <>
      <div className="row">
        <div className="col-md-10">
          <ResponsiveContainer height={height}>
            <ComposedChart
              data={showRate ? rate_data : allData}
            >
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
              {!showRate && showCI && model_errors}
              <Line
                name="Recorded Deaths"
                type="monotone"
                dataKey="truth"
                stroke="black"
                dot={false}
                strokeWidth={2}
              />
              {model_lines}
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
  width: PropTypes.number,
  height: PropTypes.number,
  sqlData: PropTypes.shape({
    data: PropTypes.array,
    truth: PropTypes.array,
  }),
  errors: PropTypes.object,
  showRate: PropTypes.bool.isRequired,
  showCI: PropTypes.bool.isRequired,
  zoom: PropTypes.bool.isRequired,
};
CompareModelsLine.defaultProps = {
  width: null,
  height: 500,
  sqlData: { data: [{ date: dayjs.valueOf() }], truth: [{ date: dayjs().valueOf() }] },
};

export default CompareModelsLine;
