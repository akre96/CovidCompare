/**
 * @file Main page of site displays graph of predicted cases
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Select from 'react-select';
import useSWR from 'swr';
import PropTypes from 'prop-types';

import CompareModelsLine from '../components/charts/CompareModelsLine';

import loc_id_map from '../lib/loc_id_map.json';

/**
 * Get result frrom api call and throw error if applicable
 * @param {string} url - url for API call
 * @return {object} - intended data returned
 */
export const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

// Displays graph of data prediction if data available
function CountryChart({ data, errors, rate, selectedCountry }) {
  if (errors) return 'An error has occurred.';
  if (!data) return <div className="row">Loading...</div>;
  return (
    <div key={selectedCountry}>
      <CompareModelsLine height={400} sqlData={data.data} showRate={rate} />
    </div>
  );
}
CountryChart.propTypes = {
  data: PropTypes.objectOf({
    data: PropTypes.arrayOf(PropTypes.object),
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

  // find location id and call api for data
  const loc_id = loc_id_map[selectedCountry];
  const { data, errors } = useSWR('/api/predictions/' + loc_id, fetcher);

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
      <h2 className="h2 pb-1">Most Recent Model Predictions by Region</h2>
      <Select
        options={selectList}
        onChange={(e) => setCountry(e.value)}
        placeholder={'Select Region...'}
      />
      <br />
      <h3>{selectedCountry}</h3>
      <ToggleButtonGroup
        type="radio"
        name="y-axis"
        onChange={(e) => setRate(e)}
        value={rate}
        className="mb-2"
      >
        {AxesToggle}
      </ToggleButtonGroup>
      <CountryChart data={data} errors={errors} rate={rate} selectedCountry={selectedCountry} />
    </>
  );
}
