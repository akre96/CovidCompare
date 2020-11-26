import React, { useState } from 'react';
import Select from 'react-select';
import useSWR from 'swr';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
dayjs.extend(customParseFormat);

import fetcher from '../lib/fetcher';
import ErrHeatmap from '../components/charts/errHeatmap';

const variableTypes = [
  'Median Absolute Percent Error',
  'Median Error',
  'Median Absolute Error',
  'Median Percent Error',
];
const errTypes = ['Total Cumulative Error', 'Weekly Error'];
const superRegions = [
  'Global',
  'North Africa and Middle East',
  'High-income',
  'Eastern Europe, Central Asia',
  'Southeast, East Asia, Oceania',
  'Sub-Saharan Africa',
  'Latin America and Caribbean',
  'South Asia',
];

// Selector for month
function MonthSelect({ data, errors, onChange, value }) {
  if (errors) return 'Error loading available months';
  if (!data) {
    return <Select options={[]} defaultValue={value} placeholder="Loading..." isLoading={true} />;
  }
  data.data.sort(
    (a, b) =>
      dayjs(a.model_month.replace(',', ''), 'MMM YYYY') -
      dayjs(b.model_month.replace(',', ''), 'MMM YYYY'),
  );
  const selectList = data.data
    .filter((m) => m.model_month !== 'N/A')
    .map((m) => ({ value: m.model_month, label: m.model_month }));
  return <Select options={selectList} defaultValue={value} onChange={onChange} />;
}
MonthSelect.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        model_month: PropTypes.string,
      }),
    ),
  }),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const ModelErrorPage = () => {
  // React hook paramaters for data selection
  const [modelMonth, setMonth] = useState('Oct, 2020');
  const [errType, setErrType] = useState(errTypes[0]);
  const [variableType, setVariableType] = useState(variableTypes[0]);
  const [superRegion, setSuperRegion] = useState(superRegions[0]);

  const { data: months, errors: m_errors } = useSWR('/api/model_errors/available_months', fetcher);
  const { data: errData } = useSWR(
    `/api/model_errors/${modelMonth}/${errType}/${variableType}`,
    fetcher,
  );

  // List of variables
  const variableSelectList = variableTypes.map((loc) => ({ value: loc, label: loc }));
  // List of error types
  const errSelectList = errTypes.map((loc) => ({ value: loc, label: loc }));
  // List of regions
  const regionSelectList = superRegions.map((loc) => ({ value: loc, label: loc }));

  return (
    <>
      <h2>How have the models performed?</h2>
      <p>Compare the predictive performance of forecasting models over time</p>
      <div className="row pb-2">
        <div className="col-md-6">
          <h5>Region</h5>
          <Select
            options={regionSelectList}
            defaultValue={regionSelectList[0]}
            onChange={(e) => setSuperRegion(e.value)}
          />
        </div>
      </div>
      <div className="row pb-2">
        <div className="col-md-4 pb-2">
          <h5>Error Metric</h5>
          <Select
            options={variableSelectList}
            defaultValue={variableSelectList[0]}
            onChange={(e) => setVariableType(e.value)}
          />
        </div>
        <div className="col-md-4 pb-2">
          <h5>Model Month</h5>
          <MonthSelect
            data={months}
            onChange={(e) => setMonth(e.value)}
            errors={m_errors}
            value={{ value: modelMonth, label: modelMonth }}
          />
        </div>
        <div className="col-md-4 pb-2">
          <h5>Error Type</h5>
          <Select
            options={errSelectList}
            defaultValue={errSelectList[0]}
            onChange={(e) => setErrType(e.value)}
          />
        </div>
      </div>
      <div className="row">
        {errData ? (
          <ErrHeatmap data={errData.data} region={superRegion} />
        ) : (
          <strong>Loading...</strong>
        )}
      </div>
    </>
  );
};

export default ModelErrorPage;
