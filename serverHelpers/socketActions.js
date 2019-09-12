const path = require('path');
const fs = require('fs');

let docs = new Map();
let rooms = new Map();
let emails = new Map();

module.exports = (socket, io) => {
	docs.set(socket.id, '');
	const RandomStr = () => {
		return [ ...Array(10) ].map((i) => (~~(Math.random() * 36)).toString(36)).join('');
	};

	const readData = (filename) => {
		fs.readFile(path.join(__dirname, `../documents/${filename}.txt`), 'utf-8', (err, data) => {
			io.to(filename).emit('changes', data);
			socket.emit('parse-data');
			rooms.set(filename, { ...rooms.get(filename), message: [ data ], pos: 0 });
		});
	};

	const getEmail = (email) => {
		emails.set(socket.id, email);
	};

	const updateMembers = () => {
		socket.broadcast.to(docs.get(socket.id)).emit('parse-data');
	};

	const createDoc = () => {
		const filename = RandomStr();
		socket.emit('doc-name', filename);
		socket.join(filename);
		docs.set(socket.id, filename);
		rooms.set(filename, {
			count: 0,
			message: [ '' ],
			pos: 0,
			isChanged: false
		});
	};

	const startData = (filename) => {
		docs.set(socket.id, filename);
		socket.emit('parse-data');

		let room = rooms.get(filename) || {
			count: 0,
			message: [ '' ],
			pos: 0,
			isChanged: false
		};

		const numClients = room.count;
		rooms.set(filename, {
			...room,
			count: room.count + 1
		});

		socket.join(filename);
		fs.access(path.join(__dirname, `../documents/${filename}.txt`), fs.F_OK, (err) => {
			if (err) {
				socket.emit('problem', 'No such file or wrong link');
			} else {
				if (numClients === 0) {
					socket.join(filename);
					readData(filename);
				} else {
					io.to(filename).emit('changes', room.message[room.pos]);
				}
			}
		});
	};

	const docChange = (msg) => {
		const filename = docs.get(socket.id);
		let room = rooms.get(filename);
		if (room.isChanged) {
			rooms.set(filename, room.message.slice(0, room.pos + 1));
			rooms.set(filename, { ...room, isChanged: false });
		}

		rooms.set(filename, { ...room, message: [ ...room.message, msg ] });
		room = rooms.get(filename);

		if (room.message.length > 20) {
			rooms.set(filename, { ...room, message: room.message.slice(1) });
		} else {
			rooms.set(filename, { ...room, pos: room.message.length - 1 });
		}

		socket.broadcast.to(filename).emit('changes', msg);
	};

	const startTyping = () => {
		socket.broadcast.to(docs.get(socket.id)).emit('start-type', emails.get(socket.id));
	};

	const stopTyping = () => {
		socket.broadcast.to(docs.get(socket.id)).emit('stop-type', emails.get(socket.id));
	};

	const onPrev = () => {
		const filename = docs.get(socket.id);
		let room = rooms.get(filename);
		if (room.pos !== 0) {
			io.to(filename).emit('changes', room.message[room.pos - 1]);
			rooms.set(filename, { ...room, isChanged: true, pos: room.pos - 1 });
		}
	};

	const onNext = () => {
		const filename = docs.get(socket.id);
		let room = rooms.get(filename);
		if (room.pos < room.message.length - 1) {
			io.to(filename).emit('changes', room.message[room.pos + 1]);
			rooms.set(filename, { ...room, isChanged: true, pos: room.pos + 1 });
		}
	};

	const saveFile = (msg) => {
		fs.access(path.join(__dirname, `../documents/${docs.get(socket.id)}.txt`), fs.F_OK, (err) => {
			if (err) {
				socket.emit('save-db');
			}
		});
		fs.writeFile(path.join(__dirname, `../documents/${docs.get(socket.id)}.txt`), msg, (err) => {
			if (err) {
				io.to(docs.get(socket.id)).emit('error', 'Cant write a file');
			} else {
				io.to(docs.get(socket.id)).emit('succes', docs.get(socket.id));
			}
		});
	};

	const disconnect = () => {
		docs.delete(socket.id);
		emails.delete(socket.id);
		const filename = docs.get(socket.id);
		let room = rooms.get(filename);
		socket.leave(filename);
		if (!room) return null;
		rooms.set(filename, {
			...room,
			count: room.count - 1
		});
	};

	return {
		docChange,
		startData,
		onNext,
		onPrev,
		disconnect,
		saveFile,
		startTyping,
		stopTyping,
		createDoc,
		getEmail,
		updateMembers
	};
};
