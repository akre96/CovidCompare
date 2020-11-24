import React, { useState } from 'react';
import Select from 'react-select';
import useSWR from 'swr';

import fetcher from '../lib/fetcher';
import ModelErrorLine from '../components/charts/modelErrorLine';

import loc_id_map from '../assets/loc_id_map.json';
import models from '../assets/models';

const ModelPredictionErrorPage = () => {
  // fixes IHME data name in models
  const renameModels = models.map((m) => ({
    ...m,
    name: m.name.replace(/_/g, '-'),
  }));
  // React Hooks for current region/country
  const [selectedCountry, setRegion] = useState('United States');
  const [modelName, setModel] = useState(renameModels[0].name);

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

  const { data, error } = useSWR(
    '/api/predictions/' + loc_id_map[selectedCountry] + '/' + modelName,
    fetcher,
  );
  if (error) {
    return 'SQL Error Encountered. Try refresing your browser.';
  }

  return (
    <>
      <h2>Historical Forecasts</h2>
      <p>All COVID-19 Forecasts and Errors</p>
      <p>
        <i>Warning:</i> May be slow to load
      </p>
      <div className="row pb-2">
        <div className="col-sm-6">
          <h5>Region/Country</h5>
          <Select
            options={regionSelectList}
            defaultValue={{ value: 'United States', label: 'United States' }}
            onChange={(e) => setRegion(e.value)}
          />
        </div>
        <div className="col-sm-6">
          <h5>Prediction Model</h5>
          <Select
            options={modelList}
            defaultValue={modelList[0]}
            onChange={(e) => setModel(e.value)}
          />
        </div>
      </div>
      {data ? <ModelErrorLine sqlData={data} name={modelName} /> : 'Loading...'}
    </>
  );
};

export default ModelPredictionErrorPage;
