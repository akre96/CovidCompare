import React, { useState } from "react"
import Select from 'react-select'
import useSWR from 'swr'

import { fetcher } from './index'
import Layout from "../components/layout"
import ErrHeatmap from '../components/charts/errHeatmap'

const variableTypes = [
  'Median Error',
  'Median Absolute Error',
  'Median Absolute Percent Error',
  'Median Percent Error'
]
const errTypes = [
  'Total Cumulative Error',
  'Weekly Error',
]
const superRegions = [
  "Global",
  "North Africa and Middle East",
  "High-income",
  "Eastern Europe, Central Asia",
  "Southeast, East Asia, Oceania",
  "Sub-Saharan Africa",
  "Latin America and Caribbean",
  "South Asia"
]

  // Selector for month
  function MonthSelect({data, errors, onChange}){
    if (errors) return "Error loading available months";
    if (!data) {
      return (
      <Select options={[]}
      placeholder="Loading..."
      isLoading={true}
      /> 
    )}
    const selectList = data.data.map((m) => (
      {value: m.model_month, label: m.model_month}
    ))
    return (
      <Select options={selectList}
        defaultValue={{value: 'Oct', label: 'Oct'}}
        onChange={onChange}
      />
    )
  }

const ModelErrorPage = () => {

  // React hook paramaters for data selection
  const [modelMonth, setMonth] = useState('Oct')
  const [errType, setErrType] = useState('Total Cumulative Error')
  const [variableType, setVariableType] = useState('Median Absolute Percent Error')
  const [superRegion, setSuperRegion] = useState('Global')

  const { data: months,  errors: m_errors} = useSWR('/api/model_errors/available_months', fetcher)
  const { data: errData,  errors: e_errors} = useSWR(
    `/api/model_errors/${modelMonth}/${errType}/${variableType}`,
    fetcher
  )

  // List of variables 
  const variableSelectList = variableTypes.map((loc) => (
    {value: loc, label: loc}
  ))
  // List of error types 
  const errSelectList = errTypes.map((loc) => (
    {value: loc, label: loc}
  ))
  // List of regions 
  const regionSelectList = superRegions.map((loc) => (
    {value: loc, label: loc}
  ))


  return (
    <Layout>
      <h2>Historical Errors in Models</h2>
      <div className="row pb-2">
        <div className="col-md-6">
          <h5>Super Region</h5>
          <Select options={regionSelectList}
            defaultValue={regionSelectList[0]}
            onChange={(e) => setSuperRegion(e.value)}
          />
        </div>
      </div>
      <div className="row pb-2">
        <div className="col-md-4">
          <h5>Error Metric</h5>
          <Select options={variableSelectList}
            defaultValue={variableSelectList[0]}
            onChange={(e) => setVariableType(e.value)}
          />
        </div>
        <div className="col-md-4">
          <h5>Model Month</h5>
          <MonthSelect
            data={months} 
            onChange={(e) => setMonth(e.value)}
            errors={m_errors}
          />
        </div>
        <div className="col-md-4">
          <h5>Error Type</h5>
          <Select options={errSelectList}
            defaultValue={errSelectList[0]}
            onChange={(e) => setErrType(e.value)}
          />
        </div>
      </div>
      <div className="row">
        {errData ?
          <ErrHeatmap 
            data={errData.data}
            region={superRegion}
          />
          :
          <strong>Loading...</strong>
        }
      </div>
    </Layout>
  )
  }

export default ModelErrorPage
