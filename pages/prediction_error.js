
import React, { useState } from 'react';
import Select from 'react-select';
import useSWR from 'swr';
import PropTypes from 'prop-types';

import { fetcher } from './index';
import ModelErrorLine from '../components/charts/modelErrorLine';

import loc_id_map from '../assets/loc_id_map.json';
import models from '../assets/models';

const ModelPredictionErrorPage = () => {
  // React Hooks for current region/country
  const [selectedCountry, setCountry] = useState('United States');
  const model = 'Delphi'

  const loc_id = loc_id_map[selectedCountry];

  const { data, errors } = useSWR('/api/predictions/' + loc_id + '/' + model, fetcher);
  if (errors) {
    return <h3>Error collecting data</h3>;
  }

  if (!data){
      return "loading";
  }
  return (
      <>
      <h3>{selectedCountry}</h3>
      <h4>{model}</h4>
      <ModelErrorLine sqlData={data} />
      </>
  )
  
}

export default ModelPredictionErrorPage
