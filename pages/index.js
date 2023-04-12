import { getDatabase, ref, child, onValue } from 'firebase/database';
import React, { useEffect, useState } from "react";
import firebaseApp from "@/services/firebase-sdk";
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import myImage from '../pages/images/logo_fpv_ukf.png';
import LineChart from '../components/LineChart';
import TemperatureChart from '../components/TemperatureChart';
import Head from 'next/head';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

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




    const parseTime = (timeString) => {
        const [date, time] = timeString.split(' ');
        const [day, month, year] = date.split('.');
        const [hours, minutes, seconds] = time.split(':');
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const processData = (data) => {
        if (!data) return [];

        const recordKeys = Object.keys(data.Temperature);

        const uniqueHourRecords = [];
        let currentRecordHour = -1;

        // Prechádzanie záznamov od najnovšieho po najstarší
        for (let i = recordKeys.length - 1; i >= 0; i--) {
            const key = recordKeys[i];
            const record = data.Temperature[key];
            console.log(record);
            const time = parseTime(record.time); // Parse the time property
            console.log(time);
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



    if (error) {
        return <p>There was an error: {error}</p>
    }

    // const dataa = [
    //     { hour: !isLoading && (data.Time ?? 'Temperature data not found'), temperature: !isLoading && (data.Temperature ?? 'Temperature data not found') },
    // ];

    const chartData = processData(data);


    return (
        <>


            {/*<Head />*/}
            {/*<div className={styles.item1}>*/}


            {/*    <Image src={myImage} alt="My Image"  width={310} height={70} />*/}
            {/*</div>*/}
            {/*<div className={styles.grid}>*/}

            {/*    <i className={styles.item2}>*/}

            {/*        /!*<LineChart />*!/*/}

            {/*        <TemperatureChart data={chartData} />*/}


            {/*    </i>*/}
            {/*    <i className={styles.item3}>*/}
            {/*        /!*<h1> {!isLoading && (data ?? 'Temperature data not found')} °C</h1>*!/*/}
            {/*        <h1>{((data?.Temperature && Object.values(data.Temperature).slice(-1)[0]?.value) ?? 'Temperature data not found')} °C</h1>*/}



            {/*    </i>*/}
            {/*    <i className={styles.item4}>*/}
            {/*        <h2>{(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C</h2>*/}
            {/*        <h2>Tlak: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C hPa</h2>*/}
            {/*        <h2>Vlhkosť: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C %</h2>*/}
            {/*        <h2>Smer vetra: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C</h2>*/}
            {/*        <h2>Rýchlosť vetra: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C km/h</h2>*/}
            {/*        <h2>Počet zrážok: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C mm</h2>*/}
            {/*    </i>*/}

            {/*</div>*/}


            <div className={styles.gridcontainer}>
                <div className={styles.item1}> <TemperatureChart data={chartData} /></div>
                <div className={styles.item4}>
                            <TemperatureChart data={chartData} />
                </div>
                <div className={styles.item5}>
                            <h1>{((data?.Temperature && Object.values(data.Temperature).slice(-1)[0]?.value) ?? 'Temperature data not found')} °C</h1>
                </div>
                <div className={styles.item6}>
                            <h2>{(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C</h2>
                            <h2>Tlak: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C hPa</h2>
                            <h2>Vlhkosť: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C %</h2>
                            <h2>Smer vetra: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C</h2>
                            <h2>Rýchlosť vetra: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C km/h</h2>
                            <h2>Počet zrážok: {(data?.Temperature && Object.values(data.Temperature)[0]?.value) ?? 'Temperature data not found'} °C mm</h2>
                </div>
                <div className={styles.item7}> <TemperatureChart data={chartData} /></div>
            </div>
        </>
    )
}
