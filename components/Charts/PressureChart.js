import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PressureChart = ({ data }) => {
    return (
        <LineChart
            width={700}
            height={350}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fill: '#312f2f' }}/>
            <YAxis tick={{ fill: '#312f2f' }}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pressure" stroke="#312f2f" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export default PressureChart;
