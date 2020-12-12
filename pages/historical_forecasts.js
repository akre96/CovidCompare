/**
 * @file Show all forecasts and associated errors for a model as a scatter plot
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState } from 'react';
import Select from 'react-select';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import dayjs from 'dayjs';

import ModelErrorLine from '../components/charts/modelErrorLine';
import fetcher from '../lib/fetcher';
import createDateTicks from '../lib/createDateTicks';

import locIdMap from '../assets/loc_id_map.json';
import models from '../assets/models';

const ModelPredictionErrorPage = () => {
  const defaultRange = [dayjs('2020-03-25').valueOf(), dayjs().valueOf()];
  const defaultMonths = createDateTicks(defaultRange).map((d) => ({ value: d, active: true }));

  // React Hooks for current region/country
  const [selectedCountry, setRegion] = useState('United States');
  const [modelName, setModel] = useState(models[0].name);
  const [months, setModelMonths] = useState(defaultMonths);

  // create query for dates
  const { data, error } = useSWR(
    `/api/historical_forecasts/${locIdMap[selectedCountry]}/${modelName}`,
    fetcher,
  );

  // List of possible regions
  const regionSelectList = Object.keys(locIdMap).map((loc) => ({
    value: loc,
    label: loc,
  }));
  // List of models
  const modelList = models.map((m) => ({
    value: m.name,
    label: m.name,
  }));

  if (error) {
    return 'SQL Error Encountered. Try refresing your browser.';
  }
  const ModelMonthButtons = months.map((m, i) => (
    <Button
      key={m.value}
      className="histMonth"
      value={i}
      onClick={(e) => {
        const temp = [...months];
        temp[e.target.value].active = !temp[e.target.value].active;
        setModelMonths(temp);
      }}
      variant={m.active ? 'secondary' : 'light'}
    >
      {dayjs(m.value).format('MMM YYYY')}
    </Button>
  ));

  const activeMonths = months.filter((m) => m.active);

  return (
    <>
      <h2>Historical Forecasts</h2>
      <p>
        This view shows all historical forecasts from each modelling group, as well as errors
        (deviations from subsequently observed truth).
      </p>
      <p>You can subset the timeseries shown to a specific month of forecasts or set of months.</p>
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
      <ModelErrorLine sqlData={data} activeMonths={activeMonths} name={modelName} />
      <div className="row justify-content-center">
        <div className="col-lg-10" style={{ overflowX: 'scroll' }}>
          <strong>Showing Models Created In:</strong>
          <ButtonGroup>{ModelMonthButtons}</ButtonGroup>
        </div>
      </div>
      <div className="row pt-2">
        <div className="col">
          <Button
            onClick={(e) => setModelMonths(months.map((m) => ({ ...m, active: false })))}
            variant="dark"
            className="mr-2"
          >
            All Off
          </Button>
          <Button
            onClick={(e) => setModelMonths(months.map((m) => ({ ...m, active: true })))}
            variant="info"
          >
            All On
          </Button>
        </div>
      </div>
    </>
  );
};

export default ModelPredictionErrorPage;
