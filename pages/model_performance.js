import React, { useState } from 'react';
import Select from 'react-select';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FaInfoCircle } from 'react-icons/fa';
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
      <p>
        This page contains aggregated summary statistics describing the out-of-sample predictive
        validity for each of the models included in the framework. A variety of error summary
        statistics are available, each of which provides different insight into aspects of model
        performance. Additionally, errors can be stratified by major world region, the month in
        which models were produced, and weekly or cumulative errors.{' '}
      </p>
      <div className="row pb-2">
        <div className="col-md-6">
          <h5>
            Region
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={
                <Popover>
                  <Popover.Title as="h3">Region Options</Popover.Title>
                  <Popover.Content>
                    Results grouped by major world region. Groupings are defined by the{' '}
                    <a
                      href="http://www.healthdata.org/gbd/faq#What%20countries%20are%20in%20each%20region?"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Global Burden of Disease Study.
                    </a>
                  </Popover.Content>
                </Popover>
              }
            >
              <FaInfoCircle fontSize={'1rem'} style={{ marginTop: '-2vw', marginLeft: '5px' }} />
            </OverlayTrigger>
          </h5>
          <Select
            options={regionSelectList}
            defaultValue={regionSelectList[0]}
            onChange={(e) => setSuperRegion(e.value)}
          />
        </div>
      </div>
      <div className="row pb-2">
        <div className="col-md-4 pb-2">
          <h5>
            Error Metric
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={
                <Popover>
                  <Popover.Title as="h3">Interpretting Error Metrics</Popover.Title>
                  <Popover.Content>
                    Different types of summary statistics that can be used to summarize errors. We
                    use medians rather than means as a metric more robust to outliers.
                    <ul>
                      <li>
                        Median absolute percent error answers the question “what percent wrong was
                        each model, on average?”.
                      </li>
                      <li>
                        Median percent error answers the question “was each model biased up or down,
                        systematically?”. A positive median percent error indicates a model tends to
                        overestimate mortality (be overly pessimistic).
                      </li>
                      <li>
                        Median absolute error and median error are similar to the above two metrics,
                        however, they use full values, not relative to the size of the epidemic in
                        each country. This tends to place a greater weight on the small number of
                        countries with large epidemics, which is why we recommend focusing on the
                        first two (relative) statistics for most questions.
                      </li>
                    </ul>
                  </Popover.Content>
                </Popover>
              }
            >
              <FaInfoCircle fontSize={'1rem'} style={{ marginTop: '-2vw', marginLeft: '5px' }} />
            </OverlayTrigger>
          </h5>
          <Select
            options={variableSelectList}
            defaultValue={variableSelectList[0]}
            onChange={(e) => setVariableType(e.value)}
          />
        </div>
        <div className="col-md-4 pb-2">
          <h5>
            Model Month
            <OverlayTrigger
              placement="auto"
              trigger="click"
              overlay={
                <Popover>
                  <Popover.Title as="h3">Interpretting Model Month</Popover.Title>
                  <Popover.Content>
                    In which month were the models in question produced? Predicting the trajectory
                    of COVID-19 mortality was very different in March 2020, than October 2020, for
                    example.
                  </Popover.Content>
                </Popover>
              }
            >
              <FaInfoCircle fontSize={'1rem'} style={{ marginTop: '-2vw', marginLeft: '5px' }} />
            </OverlayTrigger>
          </h5>
          <MonthSelect
            data={months}
            onChange={(e) => setMonth(e.value)}
            errors={m_errors}
            value={{ value: modelMonth, label: modelMonth }}
          />
        </div>
        <div className="col-md-4 pb-2">
          <h5>
            Error Type
            <OverlayTrigger
              placement="auto"
              trigger="click"
              overlay={
                <Popover>
                  <Popover.Title as="h3">Interpretting Error Type</Popover.Title>
                  <Popover.Content>
                    Total cumulative errors are calculated relative to the total amount of
                    cumulative mortality at any given time. Weekly errors are calculated only on the
                    new mortality occurring each week.
                  </Popover.Content>
                </Popover>
              }
            >
              <FaInfoCircle fontSize={'1rem'} style={{ marginTop: '-2vw', marginLeft: '5px' }} />
            </OverlayTrigger>
          </h5>
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
