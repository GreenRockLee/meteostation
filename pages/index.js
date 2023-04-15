import { getDatabase, ref, child, onValue } from 'firebase/database';
import React, { useEffect, useState } from "react";
import firebaseApp from "@/services/firebase-sdk";
import styles from '@/styles/Home.module.css'
import TemperatureChart from '../components/Charts/TemperatureChart';
import HumidityChart from "../components/Charts/HumidityChart";
import PressureChart from "../components/Charts/PressureChart";
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

        // Zmena z '/Current_data/' na '/Temperatures/'
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
                const response = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=44.34&lon=10.99&appid=2901f4a8f635b8db79974042033a8ddc`);

                console.log(response.data);
                setWeatherForecast(response.data.daily.slice(1, 6));
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

            return (
                <div key={index} className={styles.forecastItem}>
                    <p>{formatDate(dayForecast.dt)}</p>
                    <img src={weatherIconUrl} alt="Weather icon" />
                    <p>{Math.round(dayForecast.temp.day)}°C</p>
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

        const uniqueHourRecords = [];
        let currentRecordHour = -1;

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Temperature[key];
            const time = parseTime(record.time); // Parse the time property
            const hour = time.getHours();

            // Ak je aktuálna hodina odlišná od hodiny posledného záznamu, pridajte záznam do výsledkov
            if (hour !== currentRecordHour) {
                const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

                uniqueHourRecords.unshift({
                    hour: formattedTime,
                    temperature: record.value,
                });

                // Aktualizuj poslednú hodinu
                currentRecordHour = hour;

                // Ukončenie prechádzania, keď nájdeme 7 hodnôt
                if (uniqueHourRecords.length >= 7) {
                    break;
                }
            }
        }

        // Vráť pole s jedinečnými hodinami a hodnotami teploty
        return uniqueHourRecords.sort((a, b) => a.hour - b.hour);
    };
    const processDataHumididty = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Humidity);

        const uniqueHourRecords = [];
        let currentRecordHour = -1;

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Humidity[key];
            const time = parseTime(record.time); // Parse the time property
            const hour = time.getHours();

            // Ak je aktuálna hodina odlišná od hodiny posledného záznamu, pridajte záznam do výsledkov
            if (hour !== currentRecordHour) {
                const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

                uniqueHourRecords.unshift({
                    hour: formattedTime,
                    humidity: record.value,
                });

                // Aktualizuj poslednú hodinu
                currentRecordHour = hour;

                // Ukončenie prechádzania, keď nájdeme 7 hodnôt
                if (uniqueHourRecords.length >= 7) {
                    break;
                }
            }
        }

        // Vráť pole s jedinečnými hodinami a hodnotami teploty
        return uniqueHourRecords.sort((a, b) => a.hour - b.hour);
    };
    const processDataPressure = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Pressure);

        const uniqueHourRecords = [];
        let currentRecordHour = -1;

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Pressure[key];
            const time = parseTime(record.time); // Parse the time property
            const hour = time.getHours();

            // Ak je aktuálna hodina odlišná od hodiny posledného záznamu, pridajte záznam do výsledkov
            if (hour !== currentRecordHour) {
                const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

                uniqueHourRecords.unshift({
                    hour: formattedTime,
                    pressure: record.value,
                });

                // Aktualizuj poslednú hodinu
                currentRecordHour = hour;

                // Ukončenie prechádzania, keď nájdeme 7 hodnôt
                if (uniqueHourRecords.length >= 7) {
                    break;
                }
            }
        }

        // Vráť pole s jedinečnými hodinami a hodnotami teploty
        return uniqueHourRecords.sort((a, b) => a.hour - b.hour);
    };

    const chartDataTemperature = processDataTemperature(data);
    const chartDataHumidity = processDataHumididty(data);
    const chartDataPressure = processDataPressure(data);

    if (error) {
        return <p>There was an error: {error}</p>
    }

    // const dataa = [
    //     { hour: !isLoading && (data.Time ?? 'Temperature data not found'), temperature: !isLoading && (data.Temperature ?? 'Temperature data not found') },
    // ];




    return (
        <>
            <div className={styles.gridcontainer}>
                <div className={styles.item1}> <HumidityChart data={chartDataHumidity} /></div>
                <div className={styles.item4}>
                            <TemperatureChart data={chartDataTemperature} />
                </div>
                <div className={styles.item5}>
                            <h1>{renderWeatherIcon()} {((data?.Temperature && Object.values(data.Temperature).slice(-1)[0]?.value) ?? 'Fetching data...')} °C</h1>
                </div>
                <div className={styles.item6}>
                            <h2>Tlak: {(data?.Pressure && Object.values(data.Pressure)[0]?.value) ?? 'Pressure data not found'} hPa</h2>
                            <h2>Vlhkosť: {(data?.Humidity && Object.values(data.Humidity)[0]?.value) ?? 'Humidity data not found'} %</h2>
                            <h2>Smer vetra: {(data?.Wind_Direction && Object.values(data.Wind_Direction)[0]?.value) ?? 'Wind Direction data not found'}</h2>
                            <h2>Rýchlosť vetra: {(data?.Wind_Speed && Object.values(data.Wind_Speed)[0]?.value) ?? 'Wind Speed data not found'} km/h</h2>
                            <h2>Počet zrážok: {(data?.Precipitation && Object.values(data.Precipitation)[0]?.value) ?? 'Perception data not found'} mm</h2>
                </div>
                <div className={styles.item7}> <PressureChart data={chartDataPressure} /></div>
                <div className={styles.item8}>

                    <div className={styles.forecastContainer}>{renderWeatherForecast()}</div>
                </div>
            </div>
        </>
    )
}
