const io = require('socket.io')(5000);

let message = [ '' ];
let pos = message.length - 1;

io.on('connection', (socket) => {
	socket.on('start-data', () => {
		socket.emit('changes', message[pos]);
	});

	socket.on('doc-change', (msg) => {
		message.push(msg);
		if (message.length === 20) {
			message = message.slice(1);
		} else {
			pos = message.length - 1;
		}

		socket.broadcast.emit('changes', message[pos]);
	});
	socket.on('prev', () => {
		if (pos !== 0) io.emit('changes', message[(pos -= 1)]);
	});

	socket.on('next', () => {
		if (pos < message.length - 1) io.emit('changes', message[(pos += 1)]);
	});
});
