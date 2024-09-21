import axios from 'axios';
import { urls } from '@budgeting/ui/utils/urls';

const isLocal = window.location.hostname === 'localhost';
const baseURL = isLocal
  ? 'http://localhost:3000/api'
  : 'https://budgeting.scriptmasterg.com/api';

export const baseClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Redirect all 401 errors to the login page
baseClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error)
    if (error.response.status === 401) {
      window.location.href = urls.signIn;
    }
    return Promise.reject(error);
  }
);
