const Document = require('../models/documentModel');
const { getGoogleAccountFromCode, urlGoogle } = require('./googleApi');

const getLink = (req, res) => {
	const link = urlGoogle();
	res.json({ link });
};

const readCode = async (req, res) => {
	const { code } = req.body;

	const data = await getGoogleAccountFromCode(code);
	res.cookie('email', data.email, {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		httpOnly: true
	});

	if (data.email) {
		res.json({ email: data.email });
	} else {
		res.status(400);
		throw 'error';
	}
};

const getData = (req, res) => {
	const { email } = req.cookies;
	if (email) {
		res.json({ email });
	} else {
		res.status(400);
		throw 'error';
	}
};

const getDocs = (req, res) => {
	const { email } = req.cookies;
	Document.find({ creator: email }).then((docs) => {
		Document.find({ access: email }).then((docsa) => {
			res.json({
				docs,
				docsa
			});
		});
	});
};

const logout = (req, res) => {
	res.cookie('email', 'gg', { maxAge: 0 });
	res.send('done');
};

const getDocument = (req, res) => {
	const { filename } = req.params;
	const { email } = req.cookies;
	Document.findOne({ filename }).then((doc) => {
		if (doc.creator === email) {
			res.json({
				creator: true,
				access: true,
				accessD: doc.access,
				creatorName: doc.creator
			});
		} else if (doc.access.includes(email)) {
			res.json({
				creator: false,
				access: true,
				accessD: doc.access,
				creatorName: doc.creator
			});
		} else {
			res.json({
				creator: false,
				access: false
			});
		}
	});
};

const addDoc = (req, res) => {
	const { filename, access } = req.body;
	const { email } = req.cookies;
	const doc = {
		filename,
		creator: email,
		access
	};
	const newDoc = new Document(doc);
	newDoc.save().finally(() => res.send('done'));
};

const editDoc = (req, res) => {
	const { access } = req.body;
	const { filename } = req.params;
	Document.findOneAndUpdate({ filename }, { access })
		.then(() => {
			res.send('done');
		})
		.catch(() => {
			res.send('not done');
		});
};

module.exports = {
	editDoc,
	addDoc,
	getData,
	getDocs,
	getDocument,
	getLink,
	logout,
	readCode
};
