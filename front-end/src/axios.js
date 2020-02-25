import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://localhost:5000/api'
    baseURL: 'https://what-time.herokuapp.com/api'
});

export default instance;