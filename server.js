const port = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const app = express();
const helpers = require('./serverHelpers/socketActions');
const {
	editDoc,
	addDoc,
	getData,
	getDocs,
	getDocument,
	getLink,
	logout,
	readCode
} = require('./serverHelpers/controllers');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const server = app.listen(port, () => console.log(`Server started on port ${port}`));
const io = require('socket.io')(server);

//connect to mongodb
mongoose
	.connect('mongodb+srv://awesomak:Qazimoda1@cluster0-r2bzf.mongodb.net/test?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}) // Adding new mongo url parser
	.then(() => console.log('MongoDB Connected...'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

//Production settings
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

//express actions
app.get('/google', getLink);
app.post('/google-api', readCode);
app.get('/get_data', getData);
app.get('/docs', getDocs);
app.get('/logout', logout);
app.get('/doc/:filename', getDocument);
app.post('/doc', addDoc);
app.put('/doc/:filename', editDoc);

//socket.io on connect
io.on('connection', (socket) => {
	//export function
	const {
		docChange,
		createDoc,
		startData,
		onNext,
		onPrev,
		disconnect,
		saveFile,
		startTyping,
		stopTyping,
		getEmail,
		updateMembers
	} = helpers(socket, io);

	socket.on('email', getEmail);
	socket.on('create-doc', createDoc);
	socket.on('update-members', updateMembers);
	socket.on('start-data', startData);
	socket.on('start-typing', startTyping);
	socket.on('stop-typing', stopTyping);
	socket.on('doc-change', docChange);
	socket.on('prev', onPrev);
	socket.on('next', onNext);
	socket.on('save-file', saveFile);
	socket.on('disconnect', disconnect);
});
