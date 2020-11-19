import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ReferenceLine
} from 'recharts';
import dayjs from 'dayjs';


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
function CompareModelsLine({width, height, data, rate}){
    const today = dayjs().format("YYYY-MM-DD")
    const models = [
        {name: "Delphi", color: "#e84118"},
        {name: "IHME_MS_SEIR", color: "#44bd32"},
        {name: "Imperial", color: "#8c7ae6"},
        {name: "LANL", color: "#0097e6"},
        {name: "SIKJalpha", color: "#e1b12c"}
    ]
    const names = models.map(m => m.name)
    data.map((d) => {
        if(dayjs().isAfter(d.date)){
            names.map((m) => {
                d[m] = null
            })
        }
    })
    
    names.push("cases")
    const rate_data = rollingAverage(data.map((d, i) => {
        let rd = {...d}
        if (i === 0){
            names.map((m) => {
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
    const renderCustomizedLabel = ({
        x, y, name
      }) => {
        return (
          <text x={x} y={y} fill="black" textAnchor="end" dominantBaseline="central">
            {name}
          </text>
        );
      };
      
    const model_lines = models.map((m) => (
        <Line key={m.name} type='monotone' dataKey={m.name} stroke={m.color} />
    ))
    return (
        <ResponsiveContainer width={width} height={height}>
            <LineChart  data={rate ? rate_data : data}>
                <CartesianGrid strokeDasharray="5 5"/>
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) => dayjs(v).format("MMM DD")}

                />
                {model_lines}
                <Line
                    name="Recorded Cases"
                    type='monotone'
                    dataKey="cases"
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
                    label={renderCustomizedLabel}
                />
                <Legend />
                <Tooltip 
                    formatter={(v, _n, _p) => (v.toFixed(2))}
                    labelFormatter={(l) => (dayjs(l).format("MMM DD YYYY"))}
                    labelStyle={{fontWeight: 'bold'}}
                />

            </LineChart>
        </ResponsiveContainer>
        
    )

}

export default CompareModelsLine


