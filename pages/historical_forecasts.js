/**
 * @file Show all forecasts and associated errors for a model as a scatter plot
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import dayjs from 'dayjs';
import Layout from '../components/layout';

import ModelErrorLine from '../components/charts/modelErrorLine';
import fetcher from '../lib/fetcher';
import createDateTicks from '../lib/createDateTicks';

import locIdMap from '../assets/loc_id_map.json';
import models from '../assets/models';

const pageName = 'Historical Forecasts';
const pageDescription =
  'View all historical forecasts from each modelling group, as well as errors';

const ModelPredictionErrorPage = () => {
  const defaultRange = [dayjs('2020-03-25').valueOf(), dayjs().valueOf()];
  const defaultMonths = createDateTicks(defaultRange).map((d) => ({ value: d, active: true }));

  // React Hooks
  const [selectedCountry, setRegion] = useState('United States');
  const [modelName, setModel] = useState(models[0].name);
  const [months, setModelMonths] = useState(defaultMonths);
  const [isLoadingData, setLoadingData] = useState(false);
  const [isLoadingTruth, setLoadingTruth] = useState(false);
  const [data, setData] = useState([]);
  const [truth, setTruth] = useState([]);


  useEffect(() => {
    async function getTruth() {
      const tmpTruth = await fetcher(`/api/truth/${locIdMap[selectedCountry]}`);
      setTruth(tmpTruth.truth);
      setLoadingTruth(false);
    }
    setLoadingTruth(true);
    getTruth();
    return null;
  }, [selectedCountry]);

  useEffect(() => {
    let forecastData = [];
    async function getData(url) {
      setLoadingData(true)
      const tmpData = await fetcher(url);
      forecastData = [...tmpData.data, ...forecastData];
      setData(forecastData);
      setLoadingData(false)
    }
    // eslint-disable-next-line array-callback-return
    defaultMonths.map((m) => {
      console.log('[useEffect 2] in map');
      const url = `/api/historical_forecasts/${locIdMap[selectedCountry]}/${modelName}/${dayjs(
        m.value,
      ).format('MM-YYYY')}`;
      getData(url);
    });
    return null;
  }, [selectedCountry, modelName]);

  const activeMonths = months.filter((m) => m.active);
  const hideGraph = data === [] || truth === [];
  console.log('HideGraph:');
  console.log(hideGraph);

  // create query for dates
  /*
  const { data, error } = useSWR(
    `/api/historical_forecasts/${locIdMap[selectedCountry]}/${modelName}/${activeMonths
      .map((m) => dayjs(m.value).format('MM-YYYY'))
      .join('/')}`,
    fetcher,
  );
  */

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

  /*
  if (error) {
    return 'SQL Error Encountered. Try refresing your browser.';
  }
  */
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

  return (
    <Layout pageName={pageName} pageDescription={pageDescription}>
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
            onChange={(e) => {
              setData([]);
              setRegion(e.value);
            }}
          />
        </div>
        <div className="col-sm-6">
          <h5>Modeling Group</h5>
          <Select
            options={modelList}
            defaultValue={modelList[0]}
            onChange={(e) => {
              setData([]);
              setModel(e.value);
            }}
          />
        </div>
      </div>
      {hideGraph ? (
        <ModelErrorLine activeMonths={activeMonths} name={modelName} />
      ) : (
        <ModelErrorLine sqlData={{ data, truth }} activeMonths={activeMonths} name={modelName} />
      )}
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
    </Layout>
  );
};

export default ModelPredictionErrorPage;
