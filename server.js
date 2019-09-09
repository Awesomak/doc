const port = process.env.PORT || 5000;
const express = require('express');
const path = require('path');

const app = express();
app.listen(port, () => console.log(`Server started on port ${port}`));
const io = require('socket.io').listeb(app);

//Production settings
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

let message = [ '' ];
let pos = message.length - 1;
let isChanged = false;

io.on('connection', (socket) => {
	socket.on('start-data', () => {
		socket.emit('changes', message[pos]);
	});

	socket.on('doc-change', (msg) => {
		if (isChanged) {
			message = message.slice(0, pos + 1);
			isChanged = false;
		}
		message.push(msg);
		if (message.length === 20) {
			message = message.slice(1);
		} else {
			pos = message.length - 1;
		}

		socket.broadcast.emit('changes', message[pos]);
	});

	socket.on('prev', () => {
		if (pos !== 0) {
			io.emit('changes', message[(pos -= 1)]);
			isChanged = true;
		}
	});

	socket.on('next', () => {
		if (pos < message.length - 1) {
			io.emit('changes', message[(pos += 1)]);
			isChanged = true;
		}
	});
});
