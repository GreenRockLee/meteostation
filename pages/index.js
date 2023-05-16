import { getDatabase, ref, child, onValue } from 'firebase/database';
import React, { useEffect, useState } from "react";
import firebaseApp from "@/services/firebase-sdk";
import styles from '@/styles/Home.module.css'
import TemperatureChart from '../components/Charts/TemperatureChart';
import PrecipitationChart from "../components/Charts/PrecipitationChart";
import WindSpeedChart from "../components/Charts/WindSpeedChart";
import axios from 'axios';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const database = getDatabase(firebaseApp);
        const rootReference = ref(database);


        const dataListener = onValue(child(rootReference, '/'), (snapshot) => {
            const updatedData = snapshot.val();
            const temperatureData = updatedData && updatedData.Temperature; // získa dáta v zložke Temperature
            setData(updatedData, temperatureData);
            setIsLoading(false);
        }, (error) => {
            setError(error.message);
        });

        // Zrušenie listeneru po opustení stránky
        return () => {
            dataListener();
        }
    }, []);


    useEffect(() => {
        // ...

        const fetchWeatherForecast = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Nitra%2CSK&appid=6596b6a39167d33de62131477ee09880`);

                console.log(response.data);

                const dailyData = response.data.list.filter((item, index) => {
                    return index % 8 === 0;
                });

                dailyData.shift();

                setWeatherForecast(dailyData.slice(0, 5));
            } catch (error) {
                console.error('Error fetching weather forecast:', error);
            }
        };

        fetchWeatherForecast();
    }, []);

    useEffect(() => {
        // ...

        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Nitra&appid=6596b6a39167d33de62131477ee09880&units=metric`);
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, []);

    const renderWeatherIcon = () => {
        if (!weatherData) return null;
        const weatherCode = weatherData.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherCode}.png`;

        return <img src={weatherIconUrl} height="80" alt="Weather icon" />;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${days[date.getDay()]}, ${date.getDate()}`;
    };

    const renderWeatherForecast = () => {
        return weatherForecast.map((dayForecast, index) => {
            const weatherCode = dayForecast.weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherCode}.png`;

            const averageTemp = (dayForecast.main.temp_min + dayForecast.main.temp_max) / 2;

            return (
                <div key={index} className={styles.forecastItem}>
                    <p>{formatDate(dayForecast.dt)}</p>
                    <img src={weatherIconUrl} alt="Weather icon" />
                    <p>{Math.round(averageTemp - 273.15)}°C</p>
                </div>
            );
        });
    };




    const parseTime = (timeString) => {
        const [date, time] = timeString.split(' ');
        const [day, month, year] = date.split('.');
        const [hours, minutes, seconds] = time.split(':');
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const processDataTemperature = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Temperature);

        const dayTemperatureSum = {};
        const dayTemperatureCount = {};
        let uniqueDayRecords = [];

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Temperature[key];
            const time = parseTime(record.time); // Parse the time property
            const date = time.toISOString().substring(0, 10);

            if (!dayTemperatureSum[date]) {
                dayTemperatureSum[date] = 0;
                dayTemperatureCount[date] = 0;
            }

            dayTemperatureSum[date] += record.value;
            dayTemperatureCount[date] += 1;
        }

        for (const date in dayTemperatureSum) {
            const avgTemperature = dayTemperatureSum[date] / dayTemperatureCount[date];
            const day = new Date(date);
            const formattedDate = `${day.getDate().toString().padStart(2, '0')}/${(day.getMonth() + 1).toString().padStart(2, '0')}`;

            uniqueDayRecords.push({
                date: formattedDate,
                temperature: avgTemperature,
            });
        }

        uniqueDayRecords = uniqueDayRecords
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 7) // Get only the first 7 days

        return uniqueDayRecords;
    };


    const processDataPrecipitation = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Precipitation);

        const dayPrecipitationSum = {};
        const dayPrecipitationCount = {};
        let uniqueDayRecords = [];

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Precipitation[key];
            const time = parseTime(record.time); // Parse the time property
            const date = time.toISOString().substring(0, 10);

            if (!dayPrecipitationSum[date]) {
                dayPrecipitationSum[date] = 0;
                dayPrecipitationCount[date] = 0;
            }

            dayPrecipitationSum[date] += record.value;
            dayPrecipitationCount[date] += 1;
        }

        for (const date in dayPrecipitationSum) {
            const avgPrecipitation = dayPrecipitationSum[date] / dayPrecipitationCount[date];
            const day = new Date(date);
            const formattedDate = `${day.getDate().toString().padStart(2, '0')}/${(day.getMonth() + 1).toString().padStart(2, '0')}`;

            uniqueDayRecords.push({
                date: formattedDate,
                preception: avgPrecipitation,
            });
        }

        uniqueDayRecords = uniqueDayRecords
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 7) // Get only the first 7 days

        return uniqueDayRecords;
    };

    const processDataWindSpeed = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Wind_speed);

        const dayPrecipitationSum = {};
        const dayPrecipitationCount = {};
        let uniqueDayRecords = [];

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Wind_speed[key];
            const time = parseTime(record.time); // Parse the time property
            const date = time.toISOString().substring(0, 10);

            if (!dayPrecipitationSum[date]) {
                dayPrecipitationSum[date] = 0;
                dayPrecipitationCount[date] = 0;
            }

            dayPrecipitationSum[date] += record.value;
            dayPrecipitationCount[date] += 1;
        }

        for (const date in dayPrecipitationSum) {
            const avgPrecipitation = dayPrecipitationSum[date] / dayPrecipitationCount[date];
            const day = new Date(date);
            const formattedDate = `${day.getDate().toString().padStart(2, '0')}/${(day.getMonth() + 1).toString().padStart(2, '0')}`;

            uniqueDayRecords.push({
                date: formattedDate,
                windSpeed: avgPrecipitation,
            });
        }

        uniqueDayRecords = uniqueDayRecords
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 7) // Get only the first 7 days

        return uniqueDayRecords;
    };

    const chartDataTemperature = processDataTemperature(data);
    const chartDataPrecipitation = processDataPrecipitation(data);
    const chartDataWindSpeed = processDataWindSpeed(data);

    if (error) {
        return <p>There was an error: {error}</p>
    }



    return (
        <>
            <div className={styles.gridcontainer}>
                <div className={styles.item1}> <PrecipitationChart data={chartDataPrecipitation} /></div>
                <div className={styles.item4}>
                            <TemperatureChart data={chartDataTemperature} />
                </div>
                <div className={styles.item5}>
                            <h1>{renderWeatherIcon()} {((data?.Temperature && Object.values(data.Temperature).slice(-1)[0]?.value) ?? 'Fetching data...')} °C</h1>
                </div>
                <div className={styles.item6}>
                            <h2>Tlak: {(data?.Air_pressure && Object.values(data.Air_pressure)[0]?.value) ?? 'Pressure data not found'} hPa</h2>
                            <h2>Vlhkosť: {(data?.Humidity && Object.values(data.Humidity)[0]?.value) ?? 'Humidity data not found'} %</h2>
                            <h2>Smer vetra: {(data?.Wind_direction && Object.values(data.Wind_direction)[0]?.value) ?? 'Wind Direction data not found'}</h2>
                            <h2>Rýchlosť vetra: {(data?.Wind_speed && Object.values(data.Wind_speed)[0]?.value) ?? 'Wind Speed data not found'} km/h</h2>
                            <h2>Počet zrážok: {(data?.Precipitation && Object.values(data.Precipitation)[0]?.value) ?? 'Perception data not found'} mm</h2>
                </div>
                <div className={styles.item7}> <WindSpeedChart data={chartDataWindSpeed} /></div>
                <div className={styles.item8}>

                    <div className={styles.forecastContainer}>{renderWeatherForecast()}</div>
                </div>
            </div>
        </>
    )
}
