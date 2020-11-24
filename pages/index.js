/**
 * @file Main page of site displays graph of predicted cases
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import fetcher from '../lib/fetcher';

import CompareModelsLine from '../components/charts/CompareModelsLine';

import loc_id_map from '../assets/loc_id_map.json';

// Displays graph of data prediction if data available
function CountryChart({ data, errors, rate, selectedCountry }) {
  if (errors) return 'An error has occurred.';
  if (!data) return <div className="row">Loading...</div>;
  return (
    <div key={selectedCountry}>
      <CompareModelsLine height={400} sqlData={data} showRate={rate} />
    </div>
  );
}
CountryChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array,
  }),
  errors: PropTypes.object,
  // rate: show case rate per day
  rate: PropTypes.bool.isRequired,
  // selectedCountry: which region to present
  selectedCountry: PropTypes.string.isRequired,
};
CountryChart.defaultProps = {
  data: null,
  errors: null,
};

// Component that is returned for home page
export default function IndexPage() {
  // React Hooks for current country and y-axis
  const [selectedCountry, setCountry] = useState('United States');
  const [rate, setRate] = useState(false);
  const [showCI, setCI] = useState(false);

  // find location id and call api for data
  const loc_id = loc_id_map[selectedCountry];
  const { data, errors } = useSWR('/api/predictions/' + loc_id, fetcher);
  if (errors) {
    return <h3>Error collecting data</h3>;
  }

  // List of possible regions
  const selectList = Object.keys(loc_id_map).map((loc) => ({
    value: loc,
    label: loc,
  }));

  // Y-axis toggle for cumulative vs per day deaths
  const axes = [
    { name: 'Cumulative Deaths', value: false },
    { name: 'Deaths Per Day', value: true },
  ];
  const AxesToggle = axes.map((radio, idx) => (
    <ToggleButton
      key={idx}
      type="radio"
      variant="secondary"
      name="radio"
      value={radio.value}
      style={{ zIndex: 'auto' }}
    >
      {radio.name}
    </ToggleButton>
  ));

  return (
    <>
      <p>
        <i>
          Framework for Comparing the Predictive Performance of International COVID-19 Mortality
          Forecasting Models
        </i>
      </p>
      <h2 className="h2 pb-1">Most Recent Model Predictions by Region</h2>
      <Select
        options={selectList}
        onChange={(e) => setCountry(e.value)}
        placeholder={'Select Region...'}
      />
      <br />
      <h3>{selectedCountry}</h3>
      <div className="row">
        <div className="col-sm-6">
          <ToggleButtonGroup
            type="radio"
            name="y-axis"
            onChange={(e) => setRate(e)}
            value={rate}
            className="mb-2 float-sm-left"
          >
            {AxesToggle}
          </ToggleButtonGroup>
        </div>
        <div className="col-sm-6">
          <Button
            className="float-sm-right"
            variant={showCI ? 'outline-secondary' : 'secondary'}
            onClick={(e) => {
              setCI(!showCI);
            }}
          >
            {showCI ? 'Hide Confidence Intervals' : 'Show Confidence Intervals'}
          </Button>
        </div>
      </div>
      <CompareModelsLine
        showCI={showCI}
        height={400}
        errors={errors}
        sqlData={data}
        showRate={rate}
      />
    </>
  );
}
