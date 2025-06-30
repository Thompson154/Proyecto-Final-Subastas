import axios from 'axios';
const API_URL = 'http://localhost:3000'; // import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);
const jsonServerInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default jsonServerInstance;