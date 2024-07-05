import { io } from "socket.io-client";

const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
const socket = io(VITE_BACKEND_HOST,{
    autoConnect: false
});

export default socket