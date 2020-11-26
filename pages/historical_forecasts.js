import React, { useState } from 'react';
import Select from 'react-select';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import dayjs from 'dayjs';

import ModelErrorLine from '../components/charts/modelErrorLine';
import fetcher from '../lib/fetcher';
import createDateTicks from '../lib/createDateTicks';

import loc_id_map from '../assets/loc_id_map.json';
import models from '../assets/models';

const ModelPredictionErrorPage = () => {
  // fixes IHME data name in models
  const renameModels = models.map((m) => ({
    ...m,
    name: m.name.replace(/_/g, '-'),
  }));
  const defaultRange = [dayjs('2020-03-25').valueOf(), dayjs().valueOf()];
  const defaultMonths = createDateTicks(defaultRange).map((d) => ({ value: d, active: true }));

  // React Hooks for current region/country
  const [selectedCountry, setRegion] = useState('United States');
  const [modelName, setModel] = useState(renameModels[0].name);
  const [months, setModelMonths] = useState(defaultMonths);

  // List of possible regions
  const regionSelectList = Object.keys(loc_id_map).map((loc) => ({
    value: loc,
    label: loc,
  }));
  // List of models
  const modelList = renameModels.map((m) => ({
    value: m.name,
    label: m.name,
  }));

  // create query for dates
  const activeMonths = months.filter((m) => m.active);
  const dateString = months
    .filter((m) => m.active)
    .map((m) => m.value)
    .join('/');
  const { data, error } = useSWR(
    '/api/predictions/' + loc_id_map[selectedCountry] + '/' + modelName + '/' + dateString,
    fetcher,
  );
  if (error) {
    return 'SQL Error Encountered. Try refresing your browser.';
  }
  const ModelMonthButtons = months.map((m, i) => (
    <Button
      key={i}
      value={i}
      onClick={(e) => {
        var temp = [...months];
        temp[e.target.value].active = !temp[e.target.value].active;
        setModelMonths(temp);
      }}
      variant={m.active ? 'secondary' : 'outline-secondary'}
    >
      {dayjs(m.value).format('MMM YYYY')}
    </Button>
  ));

  return (
    <>
      <h2>Historical Forecasts</h2>
      <p>All COVID-19 Forecasts and Errors</p>
      <p>
        <i>Warning:</i> May be slow to load
      </p>
      <div className="row pb-2">
        <div className="col-sm-6">
          <h5>Country or US State</h5>
          <Select
            options={regionSelectList}
            defaultValue={{ value: 'United States', label: 'United States' }}
            onChange={(e) => setRegion(e.value)}
          />
        </div>
        <div className="col-sm-6">
          <h5>Modeling Group</h5>
          <Select
            options={modelList}
            defaultValue={modelList[0]}
            onChange={(e) => setModel(e.value)}
          />
        </div>
      </div>
      {true ? (
        <ModelErrorLine sqlData={data} activeMonths={activeMonths} name={modelName} />
      ) : (
        'Loading...'
      )}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <strong>Showing Models Created In:</strong>
          <ButtonGroup>{ModelMonthButtons}</ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default ModelPredictionErrorPage;
