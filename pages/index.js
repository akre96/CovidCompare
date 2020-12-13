/**
 * @file Main page of site displays graph of predicted cases
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import { BsBoxArrowRight } from 'react-icons/bs';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import useSWR from 'swr';
import dayjs from 'dayjs';
import fetcher from '../lib/fetcher';
import models from '../assets/models';

import CompareModelsLine from '../components/charts/CompareModelsLine';

import locIdMap from '../assets/loc_id_map.json';

// Table rows for model showing model date
function ModelInfo() {
  const { data } = useSWR('/api/forecast/model_dates', fetcher);
  const modelInfo = models
    .filter((m) => m.current)
    .map((m) => {
      if (data) {
        const modelDate = data.data.filter((m2) => m2.model_short === m.name);
        return {
          ...m,
          model_date: dayjs(modelDate[0].model_date).format('MMM DD YYYY'),
        };
      }
      return {
        ...m,
        model_date: '...loading',
      };
    })
    .map((m) => (
      <tr key={m.name}>
        <td style={{ color: m.color }}>
          {m.name}
          <a href={m.link} rel="noreferrer" target="_blank">
            <BsBoxArrowRight style={{ marginLeft: '5px' }} />
          </a>
        </td>
        <td>{m.model_date}</td>
      </tr>
    ));
  return modelInfo;
}
// Component that is returned for home page
export default function IndexPage() {
  // React Hooks for current country and y-axis
  const [selectedCountry, setCountry] = useState('United States');
  const [rate, setRate] = useState(true);
  const [showZoom, setZoom] = useState(true);
  const [showCI, setCI] = useState(false);
  // const [filterDays, setFilterDays] = useState(7);
  const filterDays = 7;
  const [useFilter, setUseFilter] = useState(true);

  // find location id and call api for data
  const output = rate ? 'daily' : 'cumulative';
  const locId = locIdMap[selectedCountry];
  const { data, errors } = useSWR(`/api/forecast/${locId}/${output}`, fetcher);

  if (errors) {
    return <h3>Error collecting data</h3>;
  }
  // List of possible regions
  const selectList = Object.keys(locIdMap).map((loc) => ({
    value: loc,
    label: loc,
  }));

  // Y-axis toggle for cumulative vs per day deaths
  const axes = [
    { name: 'Deaths Per Day', value: true },
    { name: 'Cumulative Deaths', value: false },
  ];
  const AxesToggle = axes.map((radio) => (
    <ToggleButton
      key={radio.value}
      type="radio"
      variant="secondary"
      name="radio"
      value={radio.value}
      size="sm"
      style={{ zIndex: 'auto' }}
    >
      {radio.name}
    </ToggleButton>
  ));

  return (
    <>
      <h2 className="h2 pb-1">Current COVID-19 Forecasts</h2>
      <p>Compare predicted trajectories in COVID-19 mortality from major, global models</p>
      <Select
        options={selectList}
        onChange={(e) => setCountry(e.value)}
        placeholder="Select Country or US State..."
      />
      <br />
      <h3>{selectedCountry}</h3>
      <div className="row">
        <div className="col-6">
          <ToggleButtonGroup
            type="radio"
            name="y-axis"
            onChange={(e) => setRate(e)}
            value={rate}
            className="mb-2 float-left"
          >
            {AxesToggle}
          </ToggleButtonGroup>
        </div>
        <div className="col-6">
          <Button
            onClick={() => setUseFilter(!useFilter)}
            size="sm"
            title="Apply/remove 7 day moving average filter"
            variant={useFilter ? 'outline-dark' : 'secondary'}
          >
            {useFilter ? 'Unsmooth' : 'Smooth'}*
          </Button>
          <Button
            size="sm"
            title="Show 95% Confidence Intervals"
            variant={showCI ? 'outline-dark' : 'secondary'}
            className="mx-1"
            onClick={() => setCI(!showCI)}
          >
            {showCI ? 'Hide CI' : 'Show CI'}
          </Button>
          <Button
            title="Zoom in/out of model forecasts"
            variant={showZoom ? 'outline-dark' : 'secondary'}
            size="sm"
            onClick={(e) => setZoom(!showZoom)}
          >
            {!showZoom ? <AiOutlineZoomIn /> : <AiOutlineZoomOut />}
          </Button>
        </div>
      </div>
      <CompareModelsLine
        height={400}
        sqlData={data}
        showRate={rate}
        showCI={showCI}
        zoom={showZoom}
        filter={useFilter}
        filterDays={filterDays}
      />
      <p style={{ color: 'gray' }}>* 7 day moving average filter used for smoothing</p>
      <br />
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Model Group</th>
            <th>Predictions Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <ModelInfo />
        </tbody>
      </table>
    </>
  );
}
