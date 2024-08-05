import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const cookieJar = new CookieJar();

const axiosInstance = wrapper(axios.create({
  timeout: 5000, 
  headers: {
'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Samsung Galaxy S22 Ultra) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.0 Chrome/108.0.0.0 Mobile Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  },
  jar: cookieJar, 
  withCredentials: true 
}));

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
