import axios from 'axios';
import { ACCESS_TOKEN } from "./apiConstants";

const encodeCredentials = (username, password) => {
  return btoa(`${username}:${password}`);
};

const mikrotikApi = axios.create({
  baseURL: '/api',
});


mikrotikApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const miktotik_username = process.env.REACT_APP_MIKROTIK_USERNAME
    const mikrotik_pasword = process.env.REACT_APP_MIKROTIK_PASSWORD

    if (token) {
      const encodedCredentials = encodeCredentials(miktotik_username, mikrotik_pasword);
      config.headers.Authorization = `Basic ${encodedCredentials}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default mikrotikApi;
