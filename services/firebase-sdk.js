// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiQfO5T8yxhLEW_T-xA4fls_7CaZf48BA",
    authDomain: "testarduinowifi.firebaseapp.com",
    databaseURL: "https://testarduinowifi-default-rtdb.firebaseio.com",
    projectId: "testarduinowifi",
    storageBucket: "testarduinowifi.appspot.com",
    messagingSenderId: "227384258244",
    appId: "1:227384258244:web:9b7a6669b2545b1898e391"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp