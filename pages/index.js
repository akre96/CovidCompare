import React, { useState } from "react"
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Select from 'react-select'
import useSWR from 'swr'

import CompareModelsLine from "../components/charts/CompareModelsLine"

import loc_id_map from "../lib/loc_id_map.json"

export const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}


const IndexPage = () => {
  // React Hooks for current country and y-axis
  const [selectedCountry, setCountry] = useState('United States')
  const [rate, setRate] = useState(0)
  
  const loc_id = loc_id_map[selectedCountry]
  const { data, errors } = useSWR('/api/predictions/' + loc_id, fetcher)

  // List of possible regions
  const selectList = Object.keys(loc_id_map).map((loc) => (
    {value: loc, label: loc}
    ))


  function CountryChart({data, errors}) {
    if (errors) return "An error has occurred.";
    if (!data) return (
      <div className="row">
        Loading...
      </div>
      );
    return (
      <div key={selectedCountry}>
      <CompareModelsLine height={400} data={data.data} showRate={rate}/>
      </div>
    );
  }

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
    <>
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
      <CountryChart data={data} errors={errors} />
    </>
  )

}

export default IndexPage
