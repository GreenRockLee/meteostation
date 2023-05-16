import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TemperatureChart = ({ data }) => {
    return (
        <LineChart
            width={700}
            height={350}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#312f2f' }}/>
            <YAxis tick={{ fill: '#312f2f' }}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#312f2f" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export default TemperatureChart;
