import {getDatabase, ref, child, get} from 'firebase/database'
import React, {useEffect, useRef, useState} from "react";
import firebaseApp from "@/services/firebase-sdk";
import styles from '@/styles/Home.module.css'
export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const snapshot = useRef(null)
  const error = useRef(null)

  const getValue = async () => {
    try {
      const database = getDatabase(firebaseApp)
      const rootReference = ref(database)
      const dbGet = await get(child(rootReference, '/Current_data/'))
      const dbValue = dbGet.val()
      snapshot.current = dbValue
    }catch (getError){
      error.current = getError.message
        console.log({error})
    }
  setIsLoading(false)
  }

  useEffect(() => {
    getValue()
  }, [])

    const data = snapshot.current;
    // console.log({data})

  return (
    <>
        {/*<Head />*/}
        <div className={styles.grid}>
            <i className={styles.item}>
                <h5>Teplota: {!isLoading && (data.Temperature ?? 'Temperature data not found')} °C</h5>
                <h5>Tlak: {!isLoading && (data.Air_pressure ?? 'Temperature data not found')} hPa</h5>
                <h5>Vlhkosť: {!isLoading && (data.Humidity ?? 'Temperature data not found')} %</h5>
                <h5>Smer vetra: {!isLoading && (data.Wind_direction ?? 'Temperature data not found')}</h5>
                <h5>Rýchlosť vetra: {!isLoading && (data.Wind_speed ?? 'Temperature data not found')} km/h</h5>
                <h5>Počet zrážok: {!isLoading && (data.Precipitation ?? 'Temperature data not found')} mm</h5>
            </i>
            {/*<i className={styles.item}>A</i>*/}
            {/*<i className={styles.item}>A</i>*/}
        </div>
    </>
  )
}
