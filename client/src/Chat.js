import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const port = process.env.PORT || 5000;
const socket = io.connect(`${window.location.hostname}:${port}`);
console.log(`${window.location.hostname}:${port}`);

const Chat = () => {
	let [ value, setValue ] = useState('');

	socket.on('changes', (msg) => {
		setValue(msg);
	});

	const onChange = (val) => {
		socket.emit('doc-change', val);
		setValue(val);
	};

	const handleKey = (event) => {
		const charCode = String.fromCharCode(event.which).toLowerCase();
		if ((event.metaKey || event.ctrlKey) && charCode === 'z') {
			event.preventDefault();
			socket.emit('prev');
		}
		if ((event.metaKey || event.ctrlKey) && charCode === 'y') {
			event.preventDefault();
			socket.emit('next');
		}
	};

	useEffect(() => {
		socket.emit('start-data');
	}, []);

	return (
		<div>
			<textarea
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKey}
				value={value}
				rows="20"
				cols="100"
			/>
		</div>
	);
};

export default Chat;
