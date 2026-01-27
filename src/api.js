import axios from 'axios';


const API_URL = 'https://car-status-backend.onrender.com';
export default API_URL;

let token = localStorage.getItem('token') || '';

export const setToken = (newToken) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};


export const login = async (login, password) => {
const res = await axios.post(`${API_URL}/login`, { login, password });
setToken(res.data.token);
return res.data;
};


export const getCars = async () => {
const res = await axios.get(`${API_URL}/api/operator/cars`, { headers: { Authorization: `Bearer ${token}` } });
return res.data;
};


export const addCar = async (car) => {
const res = await axios.post(`${API_URL}/api/operator/cars`, car, { headers: { Authorization: `Bearer ${token}` } });
return res.data;
};


export const updateCarStatus = async (id, status) => {
const res = await axios.put(`${API_URL}/api/operator/cars/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
return res.data;
};