import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://mesa-rapida.herokuapp.com'
});