/**
 * @file Component used to show linechart of COVID deaths and deaths per day
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
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

/** 
 * Chart to compare models
 * @summary Compare different predictive models either cumulative deaths or per day as a line chart with errors if available. 
 Applies 7 day rolling average to data. Expects data in format from api at /api/[regions].js .
 * @param {number} height - height of component in pixels
 * @param {object} data - data from /api/[region].js api call
 * @param {bool} showRate - toggles showing deaths/day or cumulative deaths
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
function CompareModelsLine({ height, sqlData, showRate, errors, showCI }) {
  // React Hook for which models to display
  const [activeModels, setModels] = useState(models);

  if (errors) return 'Error encountered';
  // today used to draw reference line
  const today = dayjs().valueOf();

  // just names of models
  const model_names = models.map((m) => m.name);

  // lower and upper bound columns from sql query
  const lower_names = models.map((m) => `${m.name}_l`);
  const upper_names = models.map((m) => `${m.name}_u`);

  // all columns of model data from sql query data
  const names = [...model_names, ...upper_names, ...lower_names];

  // models and ground truth
  const base_names = [...model_names, 'truth'];

  // Delete model predictions before today, fill null days
  const data = [...sqlData.data];
  const dLength = data.length;
  const toAdd = [];
  if (dLength > 0) {
    data.map((d, i) => {
      const date = dayjs(d.date);
      d.date = date.valueOf();
      var nextDay = date.add(1, 'day');
      // Log date gaps to fill
      if (i < dLength - 1) {
        if (!dayjs(data[i + 1].date).isSame(nextDay, 'day')) {
          toAdd.push({
            index: i,
            startDate: nextDay,
            // converts time diff to days
            fillSize: (dayjs(data[i + 1].date) - nextDay) / 86400000,
          });
        }
      }
      // filter prediction data before today
      if (!dayjs().isBefore(d.date)) {
        names.map((m) => {
          d[m] = null;
        });
      }
    });

    // Fill date gaps
    var add_index = 0;
    toAdd.map((a) => {
      const toFill = [];
      for (let j = 0; j < a.fillSize; j++) {
        toFill.push({
          date: a.startDate.add(j, 'days').valueOf(),
          truth: null,
        });
      }
      data.splice(a.index + add_index + 1, 0, ...toFill);
      add_index += a.fillSize;
    });
  }

  // Rolling average run on daily case rate. Lower and upper bounds not used for rate
  const rate_data = rollingAverage(
    caseRate(data, base_names),
    7, // seven days
    base_names,
  );

  // Format prediction bounds for ReCharts
  data.map((d) => {
    model_names.map((m) => {
      d[`${m}_range`] = [d[`${m}_l`], d[`${m}_u`]];
    });
  });

  // Checkboxes to plot/hide model predictions
  const ModelCheckboxes = activeModels.map((m, i) => (
    <div key={i} className={'form-check form-check-inline'}>
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
        <a href={m.link} rel="noreferrer" target="_blank">
          <strong style={{ color: m.color }}>{m.name}</strong>
        </a>
      </label>
    </div>
  ));

  // models to plot
  const model_lines = activeModels.map((m) => {
    if (!m.active) {
      return;
    }
    return <Line key={m.name} type="monotone" dataKey={m.name} stroke={m.color} />;
  });

  // lower/upper bounds of models
  const model_errors = activeModels.map((m) => {
    if (!m.active) {
      return;
    }
    return (
      <Area
        key={`${m.name}_range`}
        legendType={'none'}
        type="monotone"
        dataKey={`${m.name}_range`}
        stroke={m.color}
        fill={m.color}
        fillOpacity={0.5}
      />
    );
  });

  // Hides tooltip for lower/upper bounds
  function tooltipFormatter(v, _n, _p) {
    try {
      return v.toFixed(2);
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
    return `${nweeks} weeks ahead`;
  }
  function yTickFormatter(v) {
    if (showRate) return v;
    if (v === 0) return v;
    return `${(v / 1000).toFixed(1)}k`;
  }
  return (
    <>
      <div className="row">
        <div className="col-md-10">
          <ResponsiveContainer height={height}>
            <ComposedChart data={showRate ? rate_data : data}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis
                domain={[data[0].date, data.splice(-1)[0].date]}
                type="number"
                dataKey="date"
                tickFormatter={(v) => dayjs(v).format('MMM DD')}
              />
              {!showRate && showCI && model_errors}
              {model_lines}
              <Line
                name="Recorded Mortality"
                type="monotone"
                dataKey="truth"
                stroke="black"
                dot={false}
                strokeWidth={2}
              />
              <YAxis type="number" tickFormatter={yTickFormatter} />
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
          <div className={'form-group'} style={{ textAlign: 'left' }}>
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
  }),
  errors: PropTypes.object,
  showRate: PropTypes.bool.isRequired,
  showCI: PropTypes.bool.isRequired,
};
CompareModelsLine.defaultProps = {
  width: null,
  height: 500,
  sqlData: { data: [{ date: dayjs.valueOf() }] },
};

export default CompareModelsLine;
