import axios from 'axios';

const api = axios.create({
    baseURL: 'http://upmoney.ddns.net:8082/upmoney/server/'
    
});

export default api;