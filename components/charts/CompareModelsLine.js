import React, {useState} from 'react'
import {
  ResponsiveContainer, Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ReferenceLine
} from 'recharts';
import dayjs from 'dayjs';


// calculate an n day rolling average
function rollingAverage(data, n, names){
    return data.map((d, i) => {
        let rd = {...d}
        if (i < n){
            names.map((m) => {
                rd[m] = null
            })
        }
        else {
            names.map((m) => {
                if (d[m] != null){
                    let c = 0
                    let avg = 0
                    for(let j = i-n; j <= i; j++){
                        if (data[j][m] != null){
                            avg += data[j][m]
                            c += 1
                        }
                    }
                    avg = avg/c
                    rd[m] = avg
                }
            })
        }
        return rd
    })
}
// Chart to compare models
function CompareModelsLine({width, height, data, showRate}){
    const today = dayjs().format("YYYY-MM-DD")
    const models = [
        {name: "Delphi", color: "#e84118", active: true},
        {name: "IHME_MS_SEIR", color: "#44bd32", active: true},
        {name: "Imperial", color: "#8c7ae6", active: true},
        {name: "LANL", color: "#0097e6", active: true},
        {name: "SIKJalpha", color: "#e1b12c", active: true}
    ]
    const model_names = models.map(m => m.name)
    const lower_names = models.map(m => `${m.name}_l`)
    const upper_names = models.map(m => `${m.name}_u`)
    const names = [
        ...model_names,
        ...upper_names,
        ...lower_names,
    ]
    data.map((d) => {
        d.date = dayjs(d.date).format("YYYY-MM-DD")
        if(!dayjs().isBefore(d.date)){
            names.map((m) => {
                d[m] = null
            })
        }
    })
    
    names.push('truth')
    const rate_data = rollingAverage(data.map((d, i) => {
        let rd = {...d}
        if (i === 0){
            [...model_names, 'truth'].map((m) => {
                rd[m] = null
            })
        }
        else {
            names.map((m) => {
                if ((d[m] != null) & (data[i-1][m] != null)){
                    rd[m] = d[m] - data[i-1][m]
                }
                else{
                    rd[m] = null
                }
            })
        }
        return rd
    }), 7, names)

    data.map((d) => {
      model_names.map((m) => {
        d[`${m}_range`] = [d[`${m}_l`], d[`${m}_u`]]
      })
    })

    const [activeModels, setModels] = useState(models)
    const ModelCheckboxes = activeModels.map((m, i) => (
        <div className={"form-check form-check-inline"}>
            <input 
                type="checkbox" 
                checked={m.active} 
                className="form-check-input" 
                id={m.name}
                value={i}
                onChange={(e) => {
                    let tempModels = [...activeModels]
                    tempModels[e.target.value] = {
                        ...activeModels[e.target.value], 
                        active: !activeModels[e.target.value].active
                    }
                    setModels(tempModels)
                }}
            />
            <label className="form-check-label" for={m.name}> 
                <strong style={{color: m.color}}>
                {m.name}
                </strong>
            </label>
        </div>
    ))
    const model_lines = activeModels.map((m) => {
        if (!m.active){
            return
        }
        return (
            <Line key={m.name} type='monotone' dataKey={m.name} stroke={m.color} />
        )
    })
    const model_errors= activeModels.map((m) => {
        if (!m.active){
            return
        }
        return (
            <Area key={`${m.name}_range`}  legendType={"none"} type='monotone' dataKey={`${m.name}_range`} stroke={m.color} fill={m.color} fillOpacity={.5}/>
        )
    })

    function tooltipFormatter(v, _n, _p){
        try {
            return (v.toFixed(2))
        }
        catch {
            return [null, null]
        }
    }
    return (
        <>
        <ResponsiveContainer width={width} height={height}>
            <ComposedChart  data={showRate ? rate_data : data}>
                <CartesianGrid strokeDasharray="5 5"/>
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) => dayjs(v).format("MMM DD")}

                />
                {!showRate && model_errors}
                {model_lines}
                <Line
                    name="Recorded Cases"
                    type='monotone'
                    dataKey="truth"
                    stroke="black" 
                    dot={false}
                    strokeWidth={2}
                />
                <YAxis
                    type="number"
                />
                <ReferenceLine 
                    x={today} 
                    stroke="black"
                    strokeWidth={2}
                />
                <Tooltip 
                    formatter={tooltipFormatter}
                    labelFormatter={(l) => (dayjs(l).format("MMM DD YYYY"))}
                    labelStyle={{fontWeight: 'bold'}}
                />
            </ComposedChart>
        </ResponsiveContainer>
        <div className={"form-group"} style={{textAlign: "center"}}>
            <h5>Models</h5>
            {ModelCheckboxes}
        </div>
        </>
        
    )

}

export default CompareModelsLine


