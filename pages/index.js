import React, { useState } from "react"
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Select from 'react-select'
import useSWR from 'swr'

import Layout from "../components/layout"
import CompareModelsLine from "../components/charts/CompareModelsLine"

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}
function ShowError({data, errors}) {
  if (errors) return "An error has occurred.";
  if (!data) return "Loading...";
  return (
    JSON.stringify(data)
  );
}

const IndexPage = () => {
  // React Hooks for current country and y-axis
  const [selectedCountry, setCountry] = useState('United States')
  const [rate, setRate] = useState(0)

  let sqlData = []
  const { data, errors } = useSWR('/api/predictions', fetcher)


  // List of possible regions
  const selectList = sqlData.map((countryData) => (
    {value: countryData.fieldValue, label: countryData.fieldValue}
    ))


  // Render chart for given region
  const CountryChart = sqlData.filter(
    (countryData) => (countryData.fieldValue === selectedCountry)
    )
    .map((countryData) => (
    <div key={selectedCountry}>
    <CompareModelsLine height={400} data={countryData.nodes} rate={rate}/>
    </div>
  ))

  // Y-axis toggle
  const axes = [
    {name: "Cumulative Deaths", value: 0},
    {name: "Deaths Per Day", value: 1}
  ]
  const AxesToggle = axes.map((radio, idx) => (
    <ToggleButton
    key={idx}
    type="radio"
    variant="secondary"
    name="radio"
    value={radio.value}
    style={{zIndex: "auto"}}
  >
    {radio.name}
  </ToggleButton>
  ))

  return (
    <Layout>
      <h2 className="h2 pb-1">Most Recent Model Predictions by Region</h2>
      <Select options={selectList}
        onChange={(e) => setCountry(e.value)}
        placeholder={'Select Region...'}
      />
      <br />
      <h3>
        {selectedCountry}
      </h3>
      <ToggleButtonGroup type="radio" name="y-axis"
        onChange={(e) => setRate(e)}
        value={rate}
        className="mb-2"
      >
       {AxesToggle}
      </ToggleButtonGroup>
      {CountryChart}
      <br />
      <ShowError data={data} errors={errors} />
    </Layout>
  )

}

export default IndexPage
