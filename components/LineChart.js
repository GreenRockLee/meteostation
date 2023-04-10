import { Line } from 'react-chartjs-2';
import { Chart, LinearScale } from 'chart.js';
import { PointElement } from 'chart.js';
import { LineElement } from 'chart.js';

Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
const LineChart = () => {
    const data = {
        labels: [19.3, 20.3, 21.3, 22.3, 23.3, 24.3, 25.3],
        datasets: [
            {
                data: [13, 15, 17, 16, 19, 21, 20],
                borderColor: 'black',
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'linear',
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LineChart;
