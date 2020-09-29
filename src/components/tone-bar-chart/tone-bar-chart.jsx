import React, { useCallback } from 'react'
import {BarChart, XAxis, YAxis, Legend, Bar} from "recharts";

export const ToneBarChart = (props) => {
    const { data } = props

    const renderBars = useCallback((barsData) => {
        return Object.keys(barsData).map((bar) => {
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            return  <Bar dataKey={bar} fill={randomColor} />
        })
    }, [data])

    const barWidth = Object.keys(data).length > 1 ? Object.keys(data).length * 100 : 300
    return (
        <BarChart width={barWidth} height={300} data={[data]}>
            <XAxis />
            <YAxis />
            <Legend />
            {renderBars(data)}
        </BarChart>
    )
}
