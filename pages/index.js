import { getDatabase, ref, child, onValue } from 'firebase/database';
import React, { useEffect, useState } from "react";
import firebaseApp from "@/services/firebase-sdk";
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import myImage from '../pages/images/logo_fpv_ukf.png';
import LineChart from '../components/LineChart';
import Head from 'next/head';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const database = getDatabase(firebaseApp);
        const rootReference = ref(database);

        const dataListener = onValue(child(rootReference, '/Current_data/'), (snapshot) => {
            const updatedData = snapshot.val();
            setData(updatedData);
            setIsLoading(false);
        }, (error) => {
            setError(error.message);
        });

        // Zrušenie listeneru po opustení stránky
        return () => {
            dataListener();
        }
    }, []);

    if (error) {
        return <p>There was an error: {error}</p>
    }

    return (
        <>


            {/*<Head />*/}
            <div className={styles.item2}>
                <Image src={myImage} alt="My Image"  width={310} height={70} />
            </div>
            <div className={styles.grid}>

                <i className={styles.item}>

                    <LineChart />

                    {/*<Head>*/}
                    {/*    <title>Next.js LineChart.js Demo</title>*/}
                    {/*    <meta name="description" content="A simple demo of LineChart.js in Next.js" />*/}
                    {/*    <link rel="icon" href="/favicon.ico" />*/}
                    {/*</Head>*/}
                    {/*<BarChart />*/}
                    {/*<canvas id="myChart" style={{ width: "100%", maxWidth: 600 }} />*/}

                </i>
                <i className={styles.item}>
                    <h1> {!isLoading && (data.Temperature ?? 'Temperature data not found')} °C</h1>
                </i>
                <i className={styles.item}>
                    {/*<h2>Teplota: {!isLoading && (data.Temperature ?? 'Temperature data not found')} °C</h2>*/}
                    <h2>Tlak: {!isLoading && (data.Air_pressure ?? 'Temperature data not found')} hPa</h2>
                    <h2>Vlhkosť: {!isLoading && (data.Humidity ?? 'Temperature data not found')} %</h2>
                    <h2>Smer vetra: {!isLoading && (data.Wind_direction ?? 'Temperature data not found')}</h2>
                    <h2>Rýchlosť vetra: {!isLoading && (data.Wind_speed ?? 'Temperature data not found')} km/h</h2>
                    <h2>Počet zrážok: {!isLoading && (data.Precipitation ?? 'Temperature data not found')} mm</h2>
                </i>

            </div>
        </>
    )
}
