import io from 'socket.io-client';
import { api } from '../api';

const socket = io(api.defaults.baseURL);

export { socket };