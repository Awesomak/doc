import io from 'socket.io-client';
const socket = io.connect(window.location.hostname + ':5000');

export default socket;
