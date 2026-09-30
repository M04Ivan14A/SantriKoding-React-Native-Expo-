import axios from 'axios';

const Api = axios.create({
  // Gunakan 10.0.2.2 khusus Android Emulator
  baseURL: 'http://10.0.2.2:3000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;