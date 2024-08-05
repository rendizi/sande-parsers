import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import randomUseragent from 'random-useragent';

const cookieJar = new CookieJar();

const axiosInstance: AxiosInstance = wrapper(axios.create({
  timeout: 5000,
  headers: {
    'User-Agent': randomUseragent.getRandom(),
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

const setRandomUserAgent = (): void => {
  axiosInstance.defaults.headers['User-Agent'] = randomUseragent.getRandom();
  console.log(axiosInstance.defaults.headers['User-Agent'])
};

export default axiosInstance;
export { setRandomUserAgent };
